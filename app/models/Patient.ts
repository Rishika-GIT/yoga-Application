import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const patientSchema = new mongoose.Schema({
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
  assignedTherapist: { type: mongoose.Schema.Types.ObjectId, ref: 'Therapist' },
  role: { type: String, default: 'patient', immutable: true },
}, { timestamps: true });

// Hash password before saving
patientSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
patientSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Patient = mongoose.models.Patient || mongoose.model('Patient', patientSchema);

export default Patient; 