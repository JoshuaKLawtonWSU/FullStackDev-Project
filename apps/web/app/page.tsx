import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { greet } from "@repo/utils/messages";
import { AppLayout } from "../components/layout/appLayout";
import { ProductList } from "../components/products/productList";

export default async function Home() {
  try {
    // Use absolute URL with environment-specific base URL
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
    
    // Fetch products from the API
    const response = await fetch(`${baseUrl}/api/products`, {
      cache: 'no-store', // Disable caching to always get fresh data
      // Or use: next: { revalidate: 60 } // Revalidate every 60 seconds
    });
    
    // Check if the response is ok
    if (!response.ok) {
      throw new Error(`Failed to fetch products: ${response.status}`);
    }
    
    // Parse the JSON response
    const products = await response.json();

    return (
      <AppLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Products</h1>
          <ProductList products={products} />
        </div>
      </AppLayout>
    );
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return fallback UI
    return (
      <AppLayout>
        <div className={styles.container}>
          <h1 className={styles.title}>Our Products</h1>
          <p>Sorry, we couldn't load the products. Please try again later.</p>
        </div>
      </AppLayout>
    );
  }
}
