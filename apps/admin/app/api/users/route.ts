import { NextResponse } from 'next/server';
import { prisma } from "../../../../../packages/db/src/client";

export async function GET() {
  try {
    // Get all users with their order count
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        isAdmin: true,
        createdAt: true,
        updatedAt: true,
        _count: {
          select: { orders: true }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    // Transform the data to include orderCount
    const formattedUsers = users.map(user => ({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      phone: user.phone,
      isAdmin: user.isAdmin,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      orderCount: user._count.orders
    }));
    
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
