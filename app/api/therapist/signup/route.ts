import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Therapist from '@/app/models/Therapist';
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
      token,
      specialization,
      experience
    } = await request.json();

    // Check if therapist already exists
    const existingTherapist = await Therapist.findOne({ email });
    if (existingTherapist) {
      return NextResponse.json(
        { error: 'Therapist already exists' },
        { status: 400 }
      );
    }

    // Create new therapist, force isActive to true
    const therapist = await Therapist.create({
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
      token,
      specialization,
      experience
    });

    // Generate token
    const jwtToken = signToken(therapist._id.toString(), therapist.role);

    return NextResponse.json({
      status: 'success',
      token: jwtToken,
      data: {
        therapist: {
          id: therapist._id,
          name: therapist.name,
          email: therapist.email,
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
          specialization: therapist.specialization,
          experience: therapist.experience,
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