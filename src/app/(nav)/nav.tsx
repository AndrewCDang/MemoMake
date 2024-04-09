import React from "react";
import style from "./nav.module.scss";
import { signOut } from "@/auth";
import ModalBtn from "./modalBtn";
import { auth } from "@/auth";

async function Nav() {
    const session = await auth();

    return (
        <nav className={style.nav}>
            <section>Logo</section>
            <section className={style.navButtons}>
                {session ? (
                    <form
                        action={async () => {
                            "use server";
                            await signOut();
                        }}
                    >
                        <button>Sign Out</button>
                    </form>
                ) : (
                    <ModalBtn />
                )}
            </section>
        </nav>
    );
}

export default Nav;
