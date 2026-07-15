import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/lib/auth';
import connectDB from "@/lib/mongoose";
import CounsellorAlert from "@/models/CounsellorAlert";

// GET /api/counsellor/alerts — fetch open alerts for counsellor's college
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "counsellor") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await connectDB();

    const alerts = await CounsellorAlert.find({ 
      status: "open",
      college: (session.user as any).college 
    })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    return NextResponse.json({ alerts });
  } catch (error: any) {
    console.error("Alerts GET Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

// PATCH /api/counsellor/alerts — acknowledge or resolve an alert
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user || (session.user as any).role !== "counsellor") {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { alertId, status } = await req.json();
    if (!alertId || !["acknowledged", "resolved"].includes(status)) {
      return new NextResponse("Invalid payload", { status: 400 });
    }

    await connectDB();

    const updated = await CounsellorAlert.findByIdAndUpdate(
      alertId,
      { status },
      { new: true }
    );

    if (!updated) return new NextResponse("Alert not found", { status: 404 });

    return NextResponse.json({ success: true, alert: updated });
  } catch (error: any) {
    console.error("Alerts PATCH Error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
