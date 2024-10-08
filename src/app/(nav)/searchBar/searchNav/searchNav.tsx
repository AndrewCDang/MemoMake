"use client";
import React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import style from "./searchNav.module.scss";

function SearchNav({ handler }: { handler: () => void }) {
    return (
        <div className={style.searchNavContainer} onClick={handler}>
            <div className={style.navSearchIcon}>
                <div className={style.svgContainer}>
                    <HiMagnifyingGlass />
                </div>
                <div className={style.svgContainer}>
                    <HiMagnifyingGlass />
                </div>
            </div>
            <div className={style.searchBarContainer}>
                <span className={style.searchContainer}>
                    Search <span className={style.desktopText}>Flashcards</span>
                </span>
                <span className={style.searchContainerBase}>
                    Search <span className={style.desktopText}>Flashcards</span>
                </span>
                <span className={style.searchContainerHover}>
                    Search <span className={style.desktopText}>Flashcards</span>
                </span>
            </div>
        </div>
    );
}

export default SearchNav;
