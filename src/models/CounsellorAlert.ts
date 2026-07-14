import mongoose, { Schema, Document } from 'mongoose'

export interface ICounsellorAlert extends Document {
  college: string
  severity: 'high' | 'critical'
  source: 'assessment' | 'peer_escalation' | 'crisis_mode'
  consentGiven: boolean
  studentHash?: string // only present if consentGiven=true
  assessmentType?: string
  score?: number
  status: 'open' | 'acknowledged' | 'resolved'
  createdAt: Date
}

const CounsellorAlertSchema = new Schema<ICounsellorAlert>({
  college: { type: String, required: true },
  severity: { type: String, enum: ['high', 'critical'], required: true },
  source: { type: String, enum: ['assessment', 'peer_escalation', 'crisis_mode'], required: true },
  consentGiven: { type: Boolean, default: false },
  studentHash: { type: String },
  assessmentType: { type: String },
  score: { type: Number },
  status: { type: String, enum: ['open', 'acknowledged', 'resolved'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.CounsellorAlert || mongoose.model<ICounsellorAlert>('CounsellorAlert', CounsellorAlertSchema)
