import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import pool from '@/app/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const mine = searchParams.get('mine');
    const fragranceId = searchParams.get('fragrance_id');

    if (mine === 'true') {
      const { userId } = await auth();
      if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

      const result = await pool.query(
        `SELECT l.*, f.name_he as fragrance_name, f.brand_he as brand_name
         FROM listings l
         LEFT JOIN fragrances f ON f.id = l.fragrance_id
         WHERE l.seller_id = $1
         ORDER BY l.created_at DESC`,
        [userId]
      );
      return NextResponse.json({ listings: result.rows });
    }

    if (fragranceId) {
      const result = await pool.query(
        `SELECT l.*, u.full_name as seller_name, u.avatar_url as seller_avatar,
                u.avg_rating as seller_rating, u.is_verified_seller as seller_verified,
                u.total_sales as seller_sales
         FROM listings l
         JOIN users u ON u.id = l.seller_id
         WHERE l.fragrance_id = $1 AND l.is_active = true
         ORDER BY l.price ASC`,
        [fragranceId]
      );
      return NextResponse.json({ listings: result.rows });
    }

    return NextResponse.json({ listings: [] });
  } catch (err) {
    console.error('Listings GET error:', err);
    return NextResponse.json({ listings: [] });
  }
}

export async function POST(req) {
  try {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { fragranceName, brandName, price, condition, fillLevel, bottleSize, description } = body;

    if (!fragranceName || !brandName || !price) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Submit as new fragrance + listing combination
    const submissionResult = await pool.query(
      `INSERT INTO fragrance_submissions (name_he, brand_he, submitted_by, status)
       VALUES ($1, $2, $3, 'pending')
       RETURNING id`,
      [fragranceName, brandName, userId]
    );

    return NextResponse.json({ 
      message: 'Listing submitted for review',
      submissionId: submissionResult.rows[0].id
    });
  } catch (err) {
    console.error('Listings POST error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
