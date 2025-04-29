import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Patient', required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, refPath: 'recipientModel' }, // Can be Therapist or Patient
    recipientModel: { type: String, enum: ['Therapist', 'Patient'], required: function(this: any) { return !!this.recipient; } },
    type: { type: String, enum: ['therapist', 'platform', 'patient'], required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback; 