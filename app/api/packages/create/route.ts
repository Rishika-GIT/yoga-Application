import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Package from '@/app/models/Package';
import { authorize } from '@/app/middleware/auth';

export async function POST(request: Request) {
  try {
    // Only admin can create packages
    const auth = await authorize(['admin'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }

    await connectDB();
    const { name, description, price, duration, category ,image} = await request.json();

    if (!name || !price || !duration) {
      return NextResponse.json(
        { error: 'Name, price, and duration are required' },
        { status: 400 }
      );
    }

    const pkg = await Package.create({ name, description, price, duration, category ,image  });

    return NextResponse.json({
      status: 'success',
      data: { package: pkg },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 