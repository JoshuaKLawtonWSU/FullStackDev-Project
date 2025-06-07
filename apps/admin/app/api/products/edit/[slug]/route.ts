import { NextRequest, NextResponse } from "next/server";
import { prisma } from "../../../../../../../packages/db/src/client";

// GET handler to retrieve a product by slug
export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    // Validate slug
    if (!slug) {
      return NextResponse.json(
        { error: "Product slug is required" },
        { status: 400 }
      );
    }

    // Fetch product from database using slug
    const product = await prisma.product.findUnique({
      where: {
        slug: slug,
      },
      include: {
        category: true,
      },
    });

    // Check if product exists
    if (!product) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    // Return product data
    return NextResponse.json({ product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// POST handler to update a product
export async function POST(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;
    console.log("Updating product with slug:", slug);
    
    // Get product data from request body
    const body = await req.json();
    console.log("Received update data:", JSON.stringify(body, null, 2));
    
    const {
      name,
      description,
      price,
      inventory,
      categoryId,
      isActive,
      newSlug,
    } = body;

    // Find the product by slug
    const existingProduct = await prisma.product.findUnique({
      where: { slug },
      include: { images: true }
    });

    if (!existingProduct) {
      console.error(`Product with slug "${slug}" not found`);
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    console.log("Found existing product:", existingProduct.id);

    // Validate required fields
    if (!name || price === undefined) {
      console.error("Missing required fields in update request");
      return NextResponse.json(
        { error: "Missing required fields", required: ["name", "price"] },
        { status: 400 }
      );
    }

    // Prepare update data
    const updateData = {
      name,
      description,
      price: typeof price === 'string' ? parseFloat(price) : price,
      updatedAt: new Date(),
      slug,
      inventory,
      isActive,
      categoryId
    };
    
    // Add optional fields if they exist
    if (newSlug) updateData.slug = newSlug;
    if (inventory !== undefined) updateData.inventory = typeof inventory === 'string' ? parseInt(inventory) : inventory;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (categoryId !== undefined) updateData.categoryId = categoryId || null;
    

    console.log("Updating with data:", JSON.stringify(updateData, null, 2));

    // Update the product
    const updatedProduct = await prisma.product.update({
      where: { id: existingProduct.id }, // Use ID instead of slug for more reliable updates
      data: updateData,
      include: {
        category: true,
      },
    });

    console.log("Product updated successfully:", updatedProduct.id);
    
    return NextResponse.json({ 
      product: updatedProduct,
      message: "Product updated successfully" 
    });
  } catch (error) {
    console.error("Error updating product:", error);
    
    // More detailed error response
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;
    
    return NextResponse.json(
      { 
        error: "Failed to update product",
        message: errorMessage,
        stack: process.env.NODE_ENV === 'development' ? errorStack : undefined
      },
      { status: 500 }
    );
  }
}