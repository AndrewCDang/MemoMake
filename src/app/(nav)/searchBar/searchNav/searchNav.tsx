"use client";
import React from "react";
import { HiMagnifyingGlass } from "react-icons/hi2";
import style from "./searchNav.module.scss";
import { motion } from "framer-motion";

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
                <span className={style.searchContainer}>Search Flashcards</span>
                <span className={style.searchContainerBase}>
                    Search Flashcards
                </span>
                <span className={style.searchContainerHover}>
                    Search Flashcards
                </span>
            </div>
        </div>
    );
}

export default SearchNav;
