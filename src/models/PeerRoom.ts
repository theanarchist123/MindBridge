import mongoose, { Schema, Document } from 'mongoose'

export interface IPeerRoom extends Document {
  studentHash: string
  peerHash: string
  status: 'waiting' | 'active' | 'closed' | 'escalated'
  escalated: boolean
  createdAt: Date
  closedAt?: Date
}

const PeerRoomSchema = new Schema<IPeerRoom>({
  studentHash: { type: String, required: true },
  peerHash: { type: String, default: null },
  status: { type: String, enum: ['waiting', 'active', 'closed', 'escalated'], default: 'waiting' },
  escalated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  closedAt: { type: Date }
})

export default mongoose.models.PeerRoom || mongoose.model<IPeerRoom>('PeerRoom', PeerRoomSchema)
