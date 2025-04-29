import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Package from '@/app/models/Package';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Package ID is required' },
        { status: 400 }
      );
    }
    await connectDB();
    const pkg = await Package.findById(id);
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