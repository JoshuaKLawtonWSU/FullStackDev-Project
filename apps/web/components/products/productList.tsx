"use client";

import { ProductItem } from "./productItem";
import styles from "./productList.module.css";

// import type { Product } from "@repo/utils/tempData";
type Product = {
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
}

export function ProductList({ products }: { products: Product[] }) {
    if (products.length === 0) {
        return (
            <p className={styles.emptyMessage}>0 products</p>
        );
    } else {
        return (
            <div className={styles.productGrid}>
                {products.map((product) => (
                    <ProductItem key={product.id} product={product} />
                ))}
            </div>
        );
    }
}