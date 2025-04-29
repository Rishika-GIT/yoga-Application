import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Feedback from '@/app/models/Feedback';
import { authenticate } from '@/app/middleware/auth';
import Patient from '@/app/models/Patient';
import Therapist from '@/app/models/Therapist';

interface AuthUser {
  id: string;
  role: string;
  [key: string]: any;
}

export async function POST(request: Request) {
  await connectDB();
  const user = await authenticate(request) as AuthUser;
  if (user instanceof NextResponse) return user;

  const { type, recipient, recipientModel, rating, comment } = await request.json();

  if (!type || !rating || !comment || (type !== 'platform' && (!recipient || !recipientModel))) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  if (!['therapist', 'platform', 'patient'].includes(type)) {
    return NextResponse.json({ error: 'Invalid feedback type' }, { status: 400 });
  }

  const feedback = await Feedback.create({
    author: user.id,
    recipient: recipient ? recipient : undefined,
    recipientModel: recipient ? recipientModel : undefined,
    type,
    rating,
    comment,
  });

  return NextResponse.json({ status: 'success', data: { feedback } });
} 