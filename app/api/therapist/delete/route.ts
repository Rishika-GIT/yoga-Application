import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Therapist from '@/app/models/Therapist';
import { authorize } from '@/app/middleware/auth';

export async function DELETE(request: Request) {
  try {
    // Only admin can delete therapists
    const auth = await authorize(['admin'])(request);
    if (auth instanceof NextResponse) {
      return auth;
    }
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Therapist ID is required' },
        { status: 400 }
      );
    }
    await connectDB();
    const therapist = await Therapist.findByIdAndDelete(id);
    if (!therapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({
      status: 'success',
      data: null,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 