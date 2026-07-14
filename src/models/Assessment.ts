import mongoose, { Schema, Document } from 'mongoose'

export interface IAssessment extends Document {
  userId: string // stored as emailHash, not real email
  type: 'PHQ9' | 'GAD7' | 'PSS10'
  answers: number[] // raw answer values (0-3 scale)
  totalScore: number
  severity: 'minimal' | 'mild' | 'moderate' | 'severe'
  tier: 1 | 2 | 3 // 1=self-help, 2=peer, 3=counsellor
  consentToContact: boolean // only true if student explicitly opts in
  createdAt: Date
}

const AssessmentSchema = new Schema<IAssessment>({
  userId: { type: String, required: true, index: true },
  type: { type: String, enum: ['PHQ9', 'GAD7', 'PSS10'], required: true },
  answers: [{ type: Number }],
  totalScore: { type: Number, required: true },
  severity: { type: String, enum: ['minimal', 'mild', 'moderate', 'severe'], required: true },
  tier: { type: Number, enum: [1, 2, 3], required: true },
  consentToContact: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.Assessment || mongoose.model<IAssessment>('Assessment', AssessmentSchema)
