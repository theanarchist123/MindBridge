import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function PATCH() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userId = (session.user as any).id;
    await connectDB();

    await User.findByIdAndUpdate(userId, { onboardingDone: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Onboarding Done Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
