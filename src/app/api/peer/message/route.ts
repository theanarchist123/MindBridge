import { NextResponse } from "next/server";
import { pusherServer } from "@/lib/pusher";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/mongoose";
import ChatMessage from "@/models/ChatMessage";
import { analyzeToxicity } from "@/lib/perspective";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { roomId, text, sender, channel: channelName } = await req.json();

    if (!roomId || !text) {
      return new NextResponse("Missing room or text", { status: 400 });
    }

    // Phase 2: Perspective API Toxicity Check
    const toxicityScore = await analyzeToxicity(text);
    if (toxicityScore > 0.8) {
      return NextResponse.json({ 
        error: "Message flagged for violating community guidelines.",
        toxicityScore
      }, { status: 400 });
    }

    // Save message to MongoDB first so history persists
    await connectDB();
    const saved = await ChatMessage.create({
      roomId,
      sender: sender || "Anonymous",
      text,
    });

    const message = {
      id: saved._id.toString(),
      sender: saved.sender,
      text: saved.text,
      timestamp: saved.timestamp,
    };

    // Broadcast on private channel (fallback to private-room-{id})
    const pusherChannel = channelName || `private-room-${roomId}`;
    await pusherServer.trigger(pusherChannel, "new-message", message);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Pusher trigger error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

