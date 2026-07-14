import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { pusherServer } from "@/lib/pusher";

// POST /api/pusher/auth — authenticates private Pusher channels
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
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
      user_id: (session.user as any).id,
      user_info: { name: session.user.name },
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
