import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, data } = body;

    if (type === 'user.created' || type === 'user.updated') {
      const { id, email_addresses, first_name, last_name, image_url } = data;
      const email = email_addresses?.[0]?.email_address;
      const fullName = [first_name, last_name].filter(Boolean).join(' ');

      await pool.query(
        `INSERT INTO users (id, email, full_name, avatar_url, created_at, updated_at)
         VALUES ($1, $2, $3, $4, NOW(), NOW())
         ON CONFLICT (id) DO UPDATE SET
           email = EXCLUDED.email,
           full_name = EXCLUDED.full_name,
           avatar_url = EXCLUDED.avatar_url,
           updated_at = NOW()`,
        [id, email, fullName, image_url]
      );
    }

    if (type === 'user.deleted') {
      await pool.query('UPDATE users SET is_banned = true WHERE id = $1', [data.id]);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('Clerk webhook error:', err);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}
