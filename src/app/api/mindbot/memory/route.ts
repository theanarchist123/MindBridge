import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/route'
import connectDB from '@/lib/mongoose'
import MindBotMemory from '@/models/MindBotMemory'
import User from '@/models/User'

export async function DELETE() {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) return new NextResponse('Unauthorized', { status: 401 })
    
    await connectDB()
    const userId = (session.user as any).id;

    // Delete memory
    await MindBotMemory.findOneAndDelete({ userId });
    
    // Disable memory in settings to enforce consent model
    await User.findByIdAndUpdate(userId, { mindbotMemoryEnabled: false });

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('MindBot Memory DELETE Error:', error)
    return new NextResponse('Internal Server Error', { status: 500 })
  }
}
