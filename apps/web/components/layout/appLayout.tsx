import { PropsWithChildren } from "react";
import { LeftMenu } from "./leftMenu";
import { MidContent } from "./midContent";
import { TopMenu } from "./topMenu";
import styles from "./appLayout.module.css";

export async function AppLayout({
    children,
    query,
}: PropsWithChildren<{ query?: string }>) {
    return (
        <div className={styles.container}>
            <LeftMenu />
            <MidContent>
                <TopMenu query={query}/>
                {children}
            </MidContent>
        </div>
    );
}