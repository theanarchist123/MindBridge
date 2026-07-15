import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectDB from "@/lib/mongoose";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    const { username, password, role, college, inviteCode, email } = await req.json();

    if (!username || !password || !email) {
      return new NextResponse("Missing pseudonym, password, or email", { status: 400 });
    }

    if (password.length < 6) {
      return new NextResponse("Password must be at least 6 characters", { status: 400 });
    }

    // Email domain validation (.ac.in or .edu.in)
    if (!email.endsWith('.ac.in') && !email.endsWith('.edu.in')) {
      return new NextResponse("Please use a valid university email (.ac.in or .edu.in)", { status: 400 });
    }

    const allowedColleges = ['Generic University', 'Mumbai University', 'Delhi University', 'IIT Bombay'];
    if (!college || !allowedColleges.includes(college)) {
      return new NextResponse("Invalid or missing college", { status: 400 });
    }

    const requestedRole = role || "student";
    if (requestedRole === "counsellor") {
      if (inviteCode !== process.env.COUNSELLOR_INVITE_CODE) {
        return new NextResponse("Invalid invite code for counsellor registration", { status: 401 });
      }
    }

    await connectDB();

    const existingUser = await User.findOne({ pseudonym: username });
    
    if (existingUser) {
      return new NextResponse("Pseudonym already taken. Please choose another.", { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await User.create({
      pseudonym: username,
      password: hashedPassword,
      email: email,
      role: requestedRole,
      college: college,
    });

    return NextResponse.json({ 
      message: "User created successfully",
      user: {
        id: user._id,
        pseudonym: user.pseudonym,
        role: user.role
      }
    });
  } catch (error: any) {
    console.error("Registration Error:", error);
    return new NextResponse(error.message || "Internal Server Error", { status: 500 });
  }
}
