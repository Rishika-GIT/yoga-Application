import { NextResponse } from 'next/server';
import { verifyToken, getTokenFromHeader } from '../lib/jwt';

export async function authenticate(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = getTokenFromHeader(authHeader || undefined);
    console.log('AUTH HEADER:', authHeader);
    console.log('TOKEN:', token);

    if (!token) {
      return NextResponse.json(
        { error: 'Please login to access this resource' },
        { status: 401 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { error: 'Invalid or expired token' },
        { status: 401 }
      );
    }

    return decoded;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 401 }
    );
  }
}

export function authorize(allowedRoles: string[]) {
  return async (request: Request) => {
    try {
      const authHeader = request.headers.get('authorization');
      const token = getTokenFromHeader(authHeader || undefined);
      console.log('AUTH HEADER:', authHeader);
      console.log('TOKEN:', token);

      if (!token) {
        return NextResponse.json(
          { error: 'Please login to access this resource' },
          { status: 401 }
        );
      }

      const decoded = verifyToken(token) as any;
      console.log('DECODED:', decoded);
      if (!decoded) {
        return NextResponse.json(
          { error: 'Invalid or expired token' },
          { status: 401 }
        );
      }

      if (!allowedRoles.includes(decoded.role)) {
        return NextResponse.json(
          { error: 'You are not authorized to access this resource' },
          { status: 403 }
        );
      }

      return decoded;
    } catch (error) {
      return NextResponse.json(
        { error: 'Authorization error' },
        { status: 401 }
      );
    }
  };
} 