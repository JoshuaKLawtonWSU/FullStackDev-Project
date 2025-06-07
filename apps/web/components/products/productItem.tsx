import styles from "./productItem.module.css";

type Product = {
    id: number,
    name: string,
    description: string,
    price: number,
    stock: number,
}

export function ProductItem({ product }: { product: Product }) {
    const isOutOfStock = product.stock === 0;
    
    return (
        <div className={styles.productCard}>
            <div className={styles.productImage}></div>
            <div className={styles.productContent}>
                <h2 className={styles.productName}>{product.name}</h2>
                <p className={styles.productDescription}>{product.description}</p>
                <div className={styles.productFooter}>
                    <span className={styles.productPrice}>${product.price.toFixed(2)}</span>
                    <span className={`${styles.stockInfo} ${isOutOfStock ? styles.outOfStock : ''}`}>
                        {isOutOfStock ? 'Out of stock' : `${product.stock} in stock`}
                    </span>
                </div>
                <button
                    className={styles.addToCartButton}
                    onClick={() => alert(`Added ${product.name} to cart!`)}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    );
}