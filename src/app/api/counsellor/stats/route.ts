import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import Assessment from "@/models/Assessment";
import CounsellorAlert from "@/models/CounsellorAlert";
import User from "@/models/User";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || (session.user as any).role !== "counsellor") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    // 1. Get total students count
    const totalStudents = await User.countDocuments({ role: "student" });

    // 2. Get active alerts
    const alerts = await CounsellorAlert.find({ status: "open" }).sort({ createdAt: -1 });

    // 3. Severity Distribution (Aggregation)
    const severityDistribution = await Assessment.aggregate([
      {
        $group: {
          _id: "$severity",
          count: { $sum: 1 }
        }
      }
    ]);

    // Format severity distribution for Recharts
    const severityColors: any = {
      minimal: '#14b8a6', // teal
      mild: '#fbbf24',    // amber
      moderate: '#f97316',// orange
      severe: '#f43f5e',  // rose
    };
    
    const formattedSeverity = severityDistribution.map(item => ({
      name: item._id.charAt(0).toUpperCase() + item._id.slice(1),
      value: item.count,
      color: severityColors[item._id] || '#94a3b8'
    }));

    // If empty, return placeholder
    if (formattedSeverity.length === 0) {
      formattedSeverity.push({ name: 'Minimal', value: 1, color: severityColors.minimal });
    }

    // 4. Get weekly assessments count
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    const assessmentsThisWeek = await Assessment.countDocuments({
      createdAt: { $gte: oneWeekAgo }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalStudents,
        assessmentsThisWeek,
        activePeerRooms: 0, // Mock for now until Peer Chat is integrated
        alerts,
        severityDistribution: formattedSeverity
      }
    });
  } catch (error: any) {
    console.error("Counsellor Stats Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
