import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import {  authOptions  } from '@/lib/auth';
import connectDB from "@/lib/mongoose";
import ChatMessage from "@/models/ChatMessage";

// GET /api/peer/messages/[roomId] - fetch message history for a room
export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { roomId } = await params;

    await connectDB();

    // Fetch last 50 messages, sorted oldest first so UI renders top-to-bottom
    const messages = await ChatMessage.find({ roomId })
      .sort({ timestamp: 1 })
      .limit(50)
      .lean();

    const formatted = messages.map((m: any) => ({
      id: m._id.toString(),
      sender: m.sender,
      text: m.text,
      timestamp: m.timestamp,
    }));

    return NextResponse.json({ messages: formatted });
  } catch (error: any) {
    console.error("Fetch messages error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
