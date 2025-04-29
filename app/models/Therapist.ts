import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const therapistSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true },
  password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
  phoneCode: { type: String },
  phone: { type: String },
  bloodGroup: { type: String },
  emergencyContactPhone: { type: String },
  emergencyContactRelation: { type: String },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
  profileImage: { type: String, default: '' },
  token: { type: String, default: '' },
  specialization: { type: String },
  experience: { type: Number },
  patients: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Patient' }],
  role: { type: String, default: 'therapist', immutable: true },
}, { timestamps: true });

// Hash password before saving
therapistSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
therapistSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Therapist = mongoose.models.Therapist || mongoose.model('Therapist', therapistSchema);

export default Therapist; 