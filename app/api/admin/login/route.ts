import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Admin from '@/app/models/Admin';
import { signToken } from '@/app/lib/jwt';

export async function POST(request: Request) {
  try {
    await connectDB();

    const { email, password } = await request.json();

    // Check if admin exists and get password
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Check if password is correct
    const isPasswordCorrect = await admin.correctPassword(password, admin.password);
    if (!isPasswordCorrect) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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