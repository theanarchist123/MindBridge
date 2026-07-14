import mongoose, { Schema, Document } from 'mongoose'

export interface IMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface IMindBotMemory extends Document {
  userId: string
  messages: IMessage[]
  summary: string
  updatedAt: Date
}

const MessageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
})

const MindBotMemorySchema = new Schema<IMindBotMemory>({
  userId: { type: String, required: true, index: true, unique: true },
  messages: [MessageSchema],
  summary: { type: String, default: "" },
  updatedAt: { type: Date, default: Date.now }
})

export default mongoose.models.MindBotMemory || mongoose.model<IMindBotMemory>('MindBotMemory', MindBotMemorySchema)
