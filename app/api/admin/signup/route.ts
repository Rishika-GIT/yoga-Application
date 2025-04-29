import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Admin from '@/app/models/Admin';
import { signToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password, name } = await request.json();

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return NextResponse.json(
        { error: 'Admin already exists' },
        { status: 400 }
      );
    }

    // Create new admin
    const admin = await Admin.create({
      email,
      password,
      name,
    });

    // Generate token with role
    const token = signToken(admin._id.toString(), admin.role);

    return NextResponse.json({
      status: 'success',
      token,
      data: {
        admin: {
          id: admin._id,
          email: admin.email,
          name: admin.name,
          role: admin.role,
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