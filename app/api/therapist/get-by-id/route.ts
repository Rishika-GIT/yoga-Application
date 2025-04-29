import { NextResponse } from 'next/server';
import connectDB from '@/app/lib/db';
import Therapist from '@/app/models/Therapist';
import '@/app/models/Patient'; // Ensure Patient schema is registered for population

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json(
        { error: 'Therapist ID is required' },
        { status: 400 }
      );
    }
    await connectDB();
    const therapist = await Therapist.findById(id)
      .select('-password')
      .populate('patients', 'name email');
    if (!therapist) {
      return NextResponse.json(
        { error: 'Therapist not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ status: 'success', data: { therapist } });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: error.message || 'Something went wrong' },
      { status: 500 }
    );
  }
} 