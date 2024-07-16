import React from "react";
import style from "./nav.module.scss";
import { signOut } from "@/auth";
import { auth } from "@/auth";
import SearchBar from "./searchBar/searchBar";
import NavUser from "./searchBar/navItems/navUser";
import { FlashmuLogo } from "../_components/svgs/svgs";
import { redirect } from "next/navigation";
async function Nav() {
    const session = await auth();

    const signOutHandler = async () => {
        "use server";
        console.log("signning out");
        await signOut();
    };

    return (
        <nav className={style.nav}>
            <FlashmuLogo />
            <SearchBar />
            <section className={style.navButtons}>
                <NavUser session={session} />
            </section>
        </nav>
    );
}

export default Nav;
