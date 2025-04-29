import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Package from '@/app/models/Package';
import { authorize } from '@/app/middleware/auth';

export async function PUT(request: Request) {
  try {
    // Only admin can update packages
    const auth = await authorize(['admin'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }
    await connectDB();
    const updateData = await request.json();
    const pkg = await Package.findByIdAndUpdate(id, { $set: updateData }, { new: true, runValidators: true });
    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
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