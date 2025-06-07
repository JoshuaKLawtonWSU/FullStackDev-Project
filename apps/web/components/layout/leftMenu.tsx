"use client";

import Link from "next/link";
import styles from "./leftMenu.module.css";
import { useEffect, useState } from "react";

interface Category {
  id: string;
  name: string;
  slug: string;
}

export function LeftMenu() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                
                if (!response.ok) {
                    throw new Error('Failed to fetch categories');
                }
                
                const data = await response.json();
                setCategories(data);
                setIsLoading(false);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'An error occurred');
                setIsLoading(false);
            }
        };

        fetchCategories();
    }, []);

    return (
        <nav className={styles.menuContainer}>
            <h2 className={styles.menuTitle}>Categories</h2>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/" className={styles.navLink}>All Products</Link>
                </li>
                
                {isLoading && <li className={styles.navItem}>Loading categories...</li>}
                
                {error && <li className={styles.navItem}>Error: {error}</li>}
                
                {!isLoading && !error && categories.map((category) => (
                    <li key={category.id} className={styles.navItem}>
                        <Link 
                            href={`/category/${category.slug}`} 
                            className={styles.navLink}
                        >
                            {category.name}
                        </Link>
                    </li>
                ))}
            </ul>
        </nav>
    );
}