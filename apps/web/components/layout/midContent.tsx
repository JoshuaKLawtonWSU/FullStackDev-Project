import { PropsWithChildren } from "react";
import styles from "./midContent.module.css";

export function MidContent({ children }: PropsWithChildren) {
    return (
        <main className={styles.contentContainer}>
            {children}
        </main>
    );
}
