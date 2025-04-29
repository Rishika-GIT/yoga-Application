import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Feedback from '@/app/models/Feedback';
import '@/app/models/Patient';

export async function GET(request: Request, { params }: { params: { therapistId: string } }) {
  await connectDB();
  const feedbacks = await Feedback.find({
    type: 'therapist',
    recipient: params.therapistId,
  }).populate('author', 'name email');
  return NextResponse.json({ status: 'success', data: { feedbacks } });
} 