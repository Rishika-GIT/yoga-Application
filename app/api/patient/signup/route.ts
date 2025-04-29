import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Patient from '@/app/models/Patient';
import { signToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();

    const {
      name,
      email,
      password,
      phoneCode,
      phone,
      bloodGroup,
      emergencyContactPhone,
      emergencyContactRelation,
      isVerified,
      isDeleted,
      profileImage,
      token
    } = await request.json();

    // Check if patient already exists
    const existingPatient = await Patient.findOne({ email });
    if (existingPatient) {
      return NextResponse.json(
        { error: 'Patient already exists' },
        { status: 400 }
      );
    }

    // Create new patient, force isActive to true
    const patient = await Patient.create({
      name,
      email,
      password,
      phoneCode,
      phone,
      bloodGroup,
      emergencyContactPhone,
      emergencyContactRelation,
      isVerified,
      isActive: true, // Always true on signup
      isDeleted,
      profileImage,
      token
    });

    // Generate token
    const jwtToken = signToken(patient._id.toString(), patient.role);

    return NextResponse.json({
      status: 'success',
      token: jwtToken,
      data: {
        patient: {
          id: patient._id,
          name: patient.name,
          email: patient.email,
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