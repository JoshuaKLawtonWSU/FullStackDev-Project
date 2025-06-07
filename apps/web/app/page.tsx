import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import { greet } from "@repo/utils/messages";


// TEMPORARY:

// import { prisma } from "@repo/db/client";
import { prisma } from "../../../packages/db/src/client";
import { AppLayout } from "../components/layout/appLayout";

async function getUsers() {
  const users = await prisma.user.findMany();
  console.log(users);
  return users;
}

type User = {
  id: string;
  email: string;
}

const dbUsers = await getUsers();

// END TEMPORARY

// {users}: {users: Promise<User[]>}
export default function Home() {
  return (
    <AppLayout>
      { dbUsers.map((user) => (
        <div key={user.id} className={styles.userCard}>
          <p>{user.email} - {user.id}</p>
        </div>
      ))}
    </AppLayout>
  );
}
