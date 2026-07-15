import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";
import { getAcademicStressPeriod } from "@/lib/academicCalendars";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !(session.user as any)?.id) {
      return NextResponse.json({ period: null }, { status: 401 });
    }

    await connectDB();
    
    // Find the user to get their college
    const user = await User.findById((session.user as any).id);
    if (!user || !user.college) {
      return NextResponse.json({ period: null });
    }

    // Determine current stress period based on their college and the real current date
    const period = getAcademicStressPeriod(user.college);
    
    return NextResponse.json({ period, college: user.college });
  } catch (error) {
    console.error("Academic Context Error:", error);
    return NextResponse.json({ period: null }, { status: 500 });
  }
}
