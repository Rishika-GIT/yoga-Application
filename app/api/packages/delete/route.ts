import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Package from '@/app/models/Package';
import { authorize } from '@/app/middleware/auth';

export async function DELETE(request: Request) {
  try {
    // Only admin can delete packages
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
    const pkg = await Package.findByIdAndDelete(id);
    if (!pkg) {
      return NextResponse.json(
        { error: 'Package not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      status: 'success',
      message: 'Package deleted successfully',
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 