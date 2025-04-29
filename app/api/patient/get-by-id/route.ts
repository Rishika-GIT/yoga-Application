import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Patient from '@/app/models/Patient';
import { authorize } from '@/app/middleware/auth';

export async function GET(request: Request) {
  try {
    // Check authorization - admin, therapist, and the patient themselves can access
    const auth = await authorize(['admin', 'patient'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Patient ID is required' },
        { status: 400 }
      );
    }

    await connectDB();

    const patient = await Patient.findById(id)
      .select('-password')
      .populate('assignedTherapist', 'name email specialization');

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // If the user is a patient, they can only access their own data
    if (auth.role === 'patient' && auth.id !== patient._id.toString()) {
      return NextResponse.json(
        { error: 'You can only access your own data' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        patient,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 