import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/app/lib/db';

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { idDocumentUrl } = body;

    if (!idDocumentUrl) {
      return NextResponse.json({ error: 'ID document is required' }, { status: 400 });
    }

    // Update user to pending seller
    await pool.query(
      `UPDATE users 
       SET seller_status = 'pending', id_document_url = $1, updated_at = NOW()
       WHERE id = $2`,
      [idDocumentUrl, userId]
    );

    return NextResponse.json({ message: 'Application submitted successfully' });
  } catch (err) {
    console.error('Seller application POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
