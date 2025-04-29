import mongoose from 'mongoose';

const packageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // in days
  category: { type: String },
  image: { type: String },
}, { timestamps: true });

const Package = mongoose.models.Package || mongoose.model('Package', packageSchema);

export default Package; 