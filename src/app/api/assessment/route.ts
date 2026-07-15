import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import connectDB from "@/lib/mongoose";
import Assessment from "@/models/Assessment";
import CounsellorAlert from "@/models/CounsellorAlert";
import User from "@/models/User";
import { authOptions } from '@/lib/auth';
import { pusherServer } from "@/lib/pusher";

// Helper to determine severity and tier based on score and type
function calculateSeverityAndTier(type: string, score: number): { severity: "minimal" | "mild" | "moderate" | "severe", tier: 1 | 2 | 3 } {
  if (type === "PHQ9") {
    if (score <= 4) return { severity: "minimal", tier: 1 };
    if (score <= 9) return { severity: "mild", tier: 1 };
    if (score <= 14) return { severity: "moderate", tier: 2 };
    if (score <= 19) return { severity: "severe", tier: 3 };
    return { severity: "severe", tier: 3 }; // 20-27
  }
  
  if (type === "GAD7") {
    if (score <= 4) return { severity: "minimal", tier: 1 };
    if (score <= 9) return { severity: "mild", tier: 1 };
    if (score <= 14) return { severity: "moderate", tier: 2 };
    return { severity: "severe", tier: 3 }; // 15-21
  }

  // PSS10
  if (score <= 13) return { severity: "minimal", tier: 1 }; // Low stress
  if (score <= 26) return { severity: "moderate", tier: 2 }; // Moderate stress
  return { severity: "severe", tier: 3 }; // High perceived stress
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, answers, totalScore } = await req.json();

    if (!type || !answers || totalScore === undefined) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await connectDB();

    // Map frontend types (PHQ-9) to DB enums (PHQ9)
    const dbType = type.replace("-", "");
    
    const { severity, tier } = calculateSeverityAndTier(dbType, totalScore);

    const assessment = await Assessment.create({
      userId: (session.user as any).id,
      type: dbType,
      answers,
      totalScore,
      severity,
      tier,
      consentToContact: false // Set by separate flow if they consent later
    });

    let isCritical = false;
    let isHigh = false;

    if (dbType === "PHQ9") {
      // Q9 is suicidal ideation in PHQ-9 (index 8)
      if (answers[8] > 0) {
        isCritical = true;
      } else if (totalScore >= 20) {
        isHigh = true;
      }
    } else if (dbType === "GAD7") {
      if (totalScore >= 15) {
        isHigh = true;
      }
    }

    if (isCritical || isHigh) {
      const user = await User.findById((session.user as any).id);
      
      const alert = await CounsellorAlert.create({
        college: user?.college || "Generic University",
        severity: isCritical ? "critical" : "high",
        source: "assessment",
        consentGiven: false,
        assessmentType: type,
        score: totalScore,
        status: "open",
      });

      // Notify counsellors via Pusher
      await pusherServer.trigger("private-counsellor-alerts", "new-alert", alert);
    }

    return NextResponse.json({ assessment, isCritical: isCritical || isHigh }, { status: 201 });
  } catch (error) {
    console.error("Assessment POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    // Fetch all assessments for this user, sorted newest first
    const assessments = await Assessment.find({ userId: (session.user as any).id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ assessments });
  } catch (error) {
    console.error("Assessment GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
