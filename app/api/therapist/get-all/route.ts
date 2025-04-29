import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Therapist from '@/app/models/Therapist';
import { authorize } from '@/app/middleware/auth';

export async function GET(request: Request) {
  try {
    // Check authorization - only admin and therapists can get all patients
    const auth = await authorize(['admin'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const therapists = await Therapist.find()
      .select('-password')
      //.populate('assignedPatients', 'name email specialization');

    return NextResponse.json({
      status: 'success',
      results: therapists.length,
      data: {
        therapists,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 