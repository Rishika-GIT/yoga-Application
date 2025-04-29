import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Patient from '@/app/models/Patient';
import { signToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if patient exists and get password
    const patient = await Patient.findOne({ email }).select('+password');
    if (!patient) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Only allow login if isActive is true
    if (!patient.isActive) {
      return NextResponse.json(
        { error: 'Your account is not active. Please contact support.' },
        { status: 403 }
      );
    }

    // Check if password is correct
    const isPasswordCorrect = await patient.correctPassword(password, patient.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Generate token
    const token = signToken(patient._id.toString(), patient.role);

    return NextResponse.json({
      status: 'success',
      token,
      data: {
        patient: {
          id: patient._id,
          email: patient.email,
          name: patient.name,
          phoneCode: patient.phoneCode,
          phone: patient.phone,
          bloodGroup: patient.bloodGroup,
          emergencyContactPhone: patient.emergencyContactPhone,
          emergencyContactRelation: patient.emergencyContactRelation,
          isVerified: patient.isVerified,
          isActive: patient.isActive,
          isDeleted: patient.isDeleted,
          profileImage: patient.profileImage,
          token: patient.token,
          role: patient.role,
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