import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Patient from '@/app/models/Patient';
import { authorize } from '@/app/middleware/auth';

export async function DELETE(request: Request) {
  try {
    // Only admin can delete patients
    const auth = await authorize(['admin'])(request);
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

    // Find the patient first to check if exists
    const patient = await Patient.findById(id);

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Delete the patient
    await Patient.findByIdAndDelete(id);

    return NextResponse.json({
      status: 'success',
      message: 'Patient deleted successfully',
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 