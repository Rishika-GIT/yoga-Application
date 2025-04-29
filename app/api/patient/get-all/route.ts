import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Patient from '@/app/models/Patient';
import { authorize } from '@/app/middleware/auth';

export async function GET(request: Request) {
  try {
    // Check authorization - only admin and therapists can get all patients
    const auth = await authorize(['admin', 'therapist'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();

    const patients = await Patient.find()
      .select('-password')
      .populate('assignedTherapist', 'name email specialization');

    return NextResponse.json({
      status: 'success',
      results: patients.length,
      data: {
        patients,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 