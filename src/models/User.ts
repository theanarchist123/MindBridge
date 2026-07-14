import mongoose, { Schema, Document } from 'mongoose'

export interface IUser extends Document {
  pseudonym: string // display name, randomly generated on signup (used as username)
  password?: string // hashed password
  email?: string
  emailHash?: string // SHA-256 of email — used for auth lookup if using email in future
  role: 'student' | 'peer_supporter' | 'counsellor' | 'admin'
  college: string
  department: string
  semester: number
  isPeerCertified: boolean
  peerTrainingCompleted: boolean
  onboardingDone: boolean
  mindbotMemoryEnabled: boolean
  createdAt: Date
}

const UserSchema = new Schema<IUser>({
  pseudonym: { type: String, required: true, unique: true },
  password: { type: String },
  email: { type: String, sparse: true, unique: true },
  emailHash: { type: String, sparse: true, unique: true },
  role: { type: String, enum: ['student', 'peer_supporter', 'counsellor', 'admin'], default: 'student' },
  college: { type: String, required: true },
  department: { type: String, default: '' },
  semester: { type: Number, default: 1 },
  isPeerCertified: { type: Boolean, default: false },
  peerTrainingCompleted: { type: Boolean, default: false },
  onboardingDone: { type: Boolean, default: false },
  mindbotMemoryEnabled: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
})

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema)
