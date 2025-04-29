import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Therapist from '@/app/models/Therapist';
import { authorize } from '@/app/middleware/auth';
import '@/app/models/Patient'; // Ensure Patient schema is registered

export async function PUT(request: Request) {
  try {
    // Check authorization
    const auth = await authorize(['admin', 'therapist'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const email = searchParams.get('email');

    if (!id && !email) {
      return NextResponse.json(
        { error: 'Therapist ID or email is required' },
        { status: 400 }
      );
    }

    // If therapist is updating, they can only update their own data
    if (auth.role === 'therapist') {
      if (id && auth.id !== id) {
        return NextResponse.json(
          { error: 'You can only update your own data' },
          { status: 403 }
        );
      }
      if (!id && email) {
        // Find therapist by email to check ownership
        const therapist = await Therapist.findOne({ email });
        if (!therapist || auth.id !== therapist._id.toString()) {
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

    let therapist;
    if (id) {
      therapist = await Therapist.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password').populate('patients', 'name email');
    } else if (email) {
      therapist = await Therapist.findOneAndUpdate(
        { email },
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password').populate('patients', 'name email');
    }

    if (!therapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      status: 'success',
      data: {
        therapist,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 