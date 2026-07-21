import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { pusherServer } from "@/lib/pusher";

// POST /api/pusher/auth — authenticates private Pusher channels
export async function POST(req: Request) {
  try {
    const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET });
    if (!token?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.text();
    const params = new URLSearchParams(body);
    const socketId = params.get("socket_id");
    const channelName = params.get("channel_name");

    if (!socketId || !channelName) {
      return new NextResponse("Missing socket_id or channel_name", { status: 400 });
    }

    // Allow users to subscribe to private-room-* channels and presence-global
    if (!channelName.startsWith("private-room-") && channelName !== "presence-global" && channelName !== "private-counsellor-alerts") {
      return new NextResponse("Forbidden channel", { status: 403 });
    }

    const presenceData = {
      user_id: String(token.id),
      user_info: { name: token.name },
    };

    const authResponse = pusherServer.authorizeChannel(
      socketId,
      channelName,
      presenceData
    );

    return NextResponse.json(authResponse);
  } catch (error: any) {
    console.error("Pusher Auth Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
