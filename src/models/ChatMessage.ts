import mongoose, { Schema, Document } from 'mongoose'

export interface IChatMessage extends Document {
  roomId: string
  sender: string     // pseudonym, not userId - stays anonymous
  text: string
  timestamp: Date
}

const ChatMessageSchema = new Schema<IChatMessage>({
  roomId: { type: String, required: true, index: true },
  sender: { type: String, required: true },
  text: { type: String, required: true, maxlength: 2000 },
  timestamp: { type: Date, default: Date.now }
})

// TTL index: auto-delete messages older than 24 hours to protect privacy
ChatMessageSchema.index({ timestamp: 1 }, { expireAfterSeconds: 86400 })

export default mongoose.models.ChatMessage || mongoose.model<IChatMessage>('ChatMessage', ChatMessageSchema)
