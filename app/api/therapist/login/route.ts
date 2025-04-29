import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Therapist from '@/app/models/Therapist';
import { signToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if therapist exists and get password
    const therapist = await Therapist.findOne({ email }).select('+password');
    if (!therapist) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Only allow login if isActive is true
    if (!therapist.isActive) {
      return NextResponse.json(
        { error: 'Your account is not active. Please contact support.' },
        { status: 403 }
      );
    }

    // Check if password is correct
    const isPasswordCorrect = await therapist.correctPassword(password, therapist.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = signToken(therapist._id.toString(), therapist.role);

    return NextResponse.json({
      status: 'success',
      token,
      data: {
        therapist: {
          id: therapist._id,
          email: therapist.email,
          name: therapist.name,
          specialization: therapist.specialization,
          experience: therapist.experience,
          phoneCode: therapist.phoneCode,
          phone: therapist.phone,
          bloodGroup: therapist.bloodGroup,
          emergencyContactPhone: therapist.emergencyContactPhone,
          emergencyContactRelation: therapist.emergencyContactRelation,
          isVerified: therapist.isVerified,
          isActive: therapist.isActive,
          isDeleted: therapist.isDeleted,
          profileImage: therapist.profileImage,
          token: therapist.token,
          role: therapist.role,
        },
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 