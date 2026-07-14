import { NextResponse } from "next/server";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

// DEBUG ONLY - remove before production
export async function GET(req: Request) {
  try {
    await connectDB();
    const count = await User.countDocuments();
    const users = await User.find({}, { pseudonym: 1, role: 1, _id: 0 }).limit(20);
    return NextResponse.json({ connected: true, userCount: count, users });
  } catch (error: any) {
    return NextResponse.json({ connected: false, error: error.message }, { status: 500 });
  }
}
