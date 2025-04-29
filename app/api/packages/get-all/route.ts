import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Package from '@/app/models/Package';

export async function GET() {
  try {
    await connectDB();
    const packages = await Package.find();
    return NextResponse.json({
      status: 'success',
      results: packages.length,
      data: { packages },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 