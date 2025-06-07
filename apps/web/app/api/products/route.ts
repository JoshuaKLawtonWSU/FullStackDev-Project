import { NextResponse } from 'next/server';
import { prisma } from "../../../../../packages/db/src/client";

export async function GET() {
  try {
    // Fetch all products from the database
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc' // Most recent first
      }
    });

    // Return the products
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}