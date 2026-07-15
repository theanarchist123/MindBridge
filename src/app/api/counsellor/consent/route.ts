import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/mongoose";
import CounsellorAlert from "@/models/CounsellorAlert";
import User from "@/models/User";

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const { consentToContact, assessmentType, score } = await req.json();

    await connectDB();

    const user = await User.findById(userId);
    if (!user) return new NextResponse("User not found", { status: 404 });

    // Create a counsellor alert with the student's pseudonym visible
    await CounsellorAlert.create({
      college: user.college || "Generic University",
      severity: "high",
      source: "assessment",
      consentGiven: true,
      studentHash: user.pseudonym, // They consented — share pseudonym
      assessmentType: assessmentType || "Manual",
      score: score || 0,
      status: "open",
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Consent API Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
