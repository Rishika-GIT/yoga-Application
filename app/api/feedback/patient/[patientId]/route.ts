import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Feedback from '@/app/models/Feedback';
import '@/app/models/Patient';
import '@/app/models/Therapist';

export async function GET(request: Request, { params }: { params: { patientId: string } }) {
  await connectDB();
  const feedbacks = await Feedback.find({
    type: 'patient',
    recipient: params.patientId,
  }).populate('author', 'name email');
  return NextResponse.json({ status: 'success', data: { feedbacks } });
} 