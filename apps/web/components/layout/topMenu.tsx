"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import styles from "./topMenu.module.css";

export function TopMenu({ query = "" }: { query?: string }) {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState(query);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        router.push(`/search?q=${encodeURIComponent(searchTerm)}`);
    };

    const handleLogin = () => {
        router.push('/login');
    };

    return (
        <div className={styles.topMenuContainer}>
            <h1 className={styles.menuTitle}>Shop</h1>
            
            <form className={styles.searchForm} onSubmit={handleSubmit}>
                <input
                    className={styles.searchInput}
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <button 
                className={styles.loginButton}
                onClick={handleLogin}
            >
                Login
            </button>
            
            <div className={styles.cartContainer}>
                <span className={styles.cartIcon}>🛒</span>
                <h2 className={styles.cartTitle}>Cart (0)</h2>
            </div>
        </div>
    );
}