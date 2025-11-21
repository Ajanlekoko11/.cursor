import { NextRequest, NextResponse } from 'next/server';
import { getZeroConnector } from '@/lib/zero-connector/setup';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get('session')?.value;

    if (sessionToken) {
      const connector = await getZeroConnector();
      connector.deleteSession(sessionToken);
    }

    // Clear session cookie
    cookieStore.delete('session');

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

