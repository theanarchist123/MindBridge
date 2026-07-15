import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import connectDB from '@/lib/mongoose'
import User from '@/models/User'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })
    
    await connectDB()
    const user = await User.findById((session.user as any).id).lean()
    
    if (!user) return new NextResponse('User not found', { status: 404 })

    return NextResponse.json({
      mindbotMemoryEnabled: user.mindbotMemoryEnabled || false,
    })
  } catch (error) {
    console.error('Settings GET Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })
    
    const body = await req.json()
    const { mindbotMemoryEnabled } = body

    await connectDB()
    const user = await User.findByIdAndUpdate(
      (session.user as any).id,
      { mindbotMemoryEnabled },
      { new: true }
    )

    if (!user) return new NextResponse('User not found', { status: 404 })

    return NextResponse.json({ success: true, mindbotMemoryEnabled: user.mindbotMemoryEnabled })
  } catch (error) {
    console.error('Settings PATCH Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
