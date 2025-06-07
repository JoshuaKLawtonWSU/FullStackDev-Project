import Link from "next/link";
import styles from "./leftMenu.module.css";

// TODO:
// 1. Change categories to be dynamic (take from DB)

export function LeftMenu() {
    return (
        <nav className={styles.menuContainer}>
            <h2 className={styles.menuTitle}>Categories</h2>
            <ul className={styles.navList}>
                <li className={styles.navItem}>
                    <Link href="/" className={styles.navLink}>All Products</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/category/electronics" className={styles.navLink}>Electronics</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/category/clothing" className={styles.navLink}>Clothing</Link>
                </li>
                <li className={styles.navItem}>
                    <Link href="/category/home" className={styles.navLink}>Home & Kitchen</Link>
                </li>
            </ul>
        </nav>
    );
}