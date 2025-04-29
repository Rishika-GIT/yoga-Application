import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false,
  },
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  role: {
    type: String,
    default: 'admin',
    immutable: true,
  },
}, {
  timestamps: true,
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to check if password is correct
adminSchema.methods.correctPassword = async function(
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Admin = mongoose.models.Admin || mongoose.model('Admin', adminSchema);

export default Admin; 