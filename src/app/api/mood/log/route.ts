import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import MoodLog from "@/models/MoodLog";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { score, emoji, note, tags } = body;

    await connectDB();

    const moodLog = await MoodLog.create({
      userId,
      score,
      emoji,
      note: note || "",
      tags: tags || [],
    });

    return NextResponse.json({ success: true, moodLog });
  } catch (error: any) {
    console.error("Submit MoodLog Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
