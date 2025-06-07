import styles from "../../page.module.css";
import { AppLayout } from "../../../components/layout/appLayout";
import { ProductList } from "../../../components/products/productList";
import { notFound } from "next/navigation";
import Link from "next/link";

// Define the props type for the page component
export interface CategoryPageProps {
  params: {
    slug: string;
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params;
  
  // Decode the slug in case it contains URL-encoded characters
  const decodedSlug = decodeURIComponent(slug);
  
  try {
    // Use absolute URL with environment-specific base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Fetch products for this specific category from the API
    const response = await fetch(`${baseUrl}/api/categories/${decodedSlug}/products`, {
      cache: 'no-store', // Disable caching to always get fresh data
      // Or use: next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    // Handle 404 for category not found
    if (response.status === 404) {
      notFound();
    }
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    // Parse the JSON response
    const products = await response.json();

    // Format the category name for display (capitalize first letter of each word)
    const formattedCategoryName = decodedSlug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return (
      <AppLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>{formattedCategoryName}</h1>
          {products.length > 0 ? (
            <ProductList products={products} />
          ) : (
            <p>No products found in this category.</p>
          )}
          <div className={styles.backLink}>
            <Link href="/" className={styles.backButton}>
              Back to All Products
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  } catch (error) {
    console.error(`Error fetching products for category ${decodedSlug}:`, error);
    
    // Return fallback UI
    return (
      <AppLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Category: {decodedSlug}</h1>
          <p>Sorry, we couldn't load the products for this category. Please try again later.</p>
          <div className={styles.backLink}>
            <Link href="/" className={styles.backButton}>
              Back to All Products
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }
}

// Generate static metadata for the page
export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = params;
  const decodedSlug = decodeURIComponent(slug);
  
  const formattedCategoryName = decodedSlug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  
  return {
    title: `${formattedCategoryName} - Our Products`,
    description: `Browse our selection of products in the ${formattedCategoryName} category.`,
  };
}