import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Patient from '@/app/models/Patient';
import { authorize } from '@/app/middleware/auth';

export async function PUT(request: Request) {
  try {
    // Check authorization - admin and the patient themselves can update
    const auth = await authorize(['admin', 'patient'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { error: 'Patient ID or email is required' },
        { status: 400 }
      );
    }

    // If patient is updating, they can only update their own data
    if (auth.role === 'patient') {
      if (id && auth.id !== id) {
        return NextResponse.json(
          { error: 'You can only update your own data' },
          { status: 403 }
        );
      }
      if (!id && email) {
        // Find patient by email to check ownership
        const patient = await Patient.findOne({ email });
        if (!patient || auth.id !== patient._id.toString()) {
          return NextResponse.json(
            { error: 'You can only update your own data' },
            { status: 403 }
          );
        }
      }
    }

    await connectDB();

    const updateData = await request.json();
    // Only admin can update isActive and isDeleted
    if (auth.role !== 'admin') {
      delete updateData.isActive;
      delete updateData.isDeleted;
    }
    // Prevent updating sensitive fields
    delete updateData.password;
    delete updateData.role;
    delete updateData.email;

    let patient;
    if (id) {
      patient = await Patient.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select('-password')
      .populate('assignedTherapist', 'name email specialization');
    } else if (email) {
      patient = await Patient.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, runValidators: true }
      )
      .select('-password')
      .populate('assignedTherapist', 'name email specialization');
    }

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
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