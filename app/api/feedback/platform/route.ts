import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Feedback from '@/app/models/Feedback';
import Patient from '@/app/models/Patient';
import Therapist from '@/app/models/Therapist';

export async function GET() {
  await connectDB();
  const feedbacks = await Feedback.find({ type: 'platform' }).populate('author', 'name email');
  return NextResponse.json({ status: 'success', data: { feedbacks } });
} 