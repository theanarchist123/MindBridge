import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import MoodLog from "@/models/MoodLog";

// GET /api/mood/history — fetch last 30 mood logs for the current user
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30");

    await connectDB();

    const logs = await MoodLog.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    // Reverse so oldest is first (for charts)
    const chronological = [...logs].reverse();

    // Compute streak — consecutive days with a check-in ending today
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    const checkDate = new Date(today);

    for (let i = 0; i < 60; i++) {
      const dayStart = new Date(checkDate);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasLog = logs.some((log: any) => {
        const logDate = new Date(log.createdAt);
        return logDate >= dayStart && logDate <= dayEnd;
      });

      if (hasLog) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return NextResponse.json({
      logs: chronological,
      streak,
      totalLogs: logs.length,
    });
  } catch (error: any) {
    console.error("Mood History Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
