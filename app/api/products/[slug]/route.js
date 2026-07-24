import { NextResponse } from 'next/server';
import pool from '@/app/lib/db';

export async function GET(req, { params }) {
  try {
    const { slug } = await params;

    const fragranceRes = await pool.query(
      `SELECT * FROM fragrances WHERE slug = $1 AND status = 'approved' LIMIT 1`,
      [slug]
    );

    if (fragranceRes.rows.length === 0) {
      return NextResponse.json({ fragrance: null, listings: [] });
    }

    const fragrance = fragranceRes.rows[0];

    const listingsRes = await pool.query(
      `SELECT l.*, u.full_name as seller_name, u.avatar_url as seller_avatar,
              u.avg_rating as seller_rating, u.is_verified_seller as seller_verified
       FROM listings l
       JOIN users u ON u.id = l.seller_id
       WHERE l.fragrance_id = $1 AND l.is_active = true
       ORDER BY l.price ASC`,
      [fragrance.id]
    );

    return NextResponse.json({
      fragrance,
      listings: listingsRes.rows,
    });
  } catch (err) {
    console.error('Product slug API error:', err);
    return NextResponse.json({ fragrance: null, listings: [] });
  }
}
