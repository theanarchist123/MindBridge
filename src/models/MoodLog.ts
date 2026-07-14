import mongoose, { Schema, Document } from 'mongoose'

export interface IMoodLog extends Document {
  userId: string
  score: 1 | 2 | 3 | 4 | 5 // 1=terrible, 3=okay, 5=great
  emoji: string
  note: string // optional journal entry, max 500 chars
  tags: string[] // ['exam-stress', 'sleep-issues', 'social', 'family', 'academic']
  createdAt: Date
}

const MoodLogSchema = new Schema<IMoodLog>({
  userId: { type: String, required: true, index: true },
  score: { type: Number, enum: [1, 2, 3, 4, 5], required: true },
  emoji: { type: String, required: true },
  note: { type: String, maxlength: 500, default: '' },
  tags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.MoodLog || mongoose.model<IMoodLog>('MoodLog', MoodLogSchema)
