import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../packages/db/src/client";

// GET handler to retrieve all categories
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

// POST handler to create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Manual validation without Zod
    const errors: Record<string, string> = {};

    if (!body.name || body.name.length < 2) {
      errors.name = "Name must be at least 2 characters";
    }

    if (!body.slug || body.slug.length < 2) {
      errors.slug = "Slug must be at least 2 characters";
    } else if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(body.slug)) {
      errors.slug =
        "Slug must contain only lowercase letters, numbers, and hyphens";
    }

    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { errors },
        { status: 400 }
      );
    }

    // Check if slug already exists to avoid duplicates
    const existingCategory = await prisma.category.findUnique({
      where: { slug: body.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this slug already exists" },
        { status: 409 }
      );
    }

    // Create the new category
    const newCategory = await prisma.category.create({
      data: {
        name: body.name,
        slug: body.slug,
        description: body.description || null, // Handle optional description
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}