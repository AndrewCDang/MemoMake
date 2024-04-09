import styles from "./home.module.scss";
import Link from "next/link";
import { ReactNode } from "react";
import EmailTemplate from "@/app/(auth)/emailTemplate";
// import { auth } from "@/app/styles/auth";

export default async function Home({ children }: { children: ReactNode }) {
    // const session = await auth();
    return (
        <main className={styles.main}>
            <section>
                <section>
                    <button>Add Flash Card</button>
                </section>
                <section>
                    <Link href={"/dashboard/abc123"}>
                        <div>FlashCard 1</div>
                    </Link>
                </section>
                {children}
                {/* <EmailTemplate
                    userName={session?.user.name || "Tim"}
                    token="123123"
                /> */}
            </section>
        </main>
    );
}
