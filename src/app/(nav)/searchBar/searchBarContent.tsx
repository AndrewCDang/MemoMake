"use client";
import React, { useState } from "react";
import SearchNav from "./searchNav/searchNav";
import { AnimatePresence, motion } from "framer-motion";
import SearchActive from "./searchActive/searchActive";
import style from "./searchBar.module.scss";
import {
    Flashcard_collection_with_count,
    Flashcard_set_with_count,
} from "@/app/_types/types";

type SearchBarContentTypes = {
    listSet: Flashcard_set_with_count[];
    listCollection: Flashcard_collection_with_count[];
};

function SearchBarContent({ listSet, listCollection }: SearchBarContentTypes) {
    const [searchActive, setSearchActive] = useState<boolean>(false);
    const [searchType, setSearchType] = useState<string>("All");

    return (
        <div>
            <AnimatePresence initial={false}>
                {!searchActive && (
                    <motion.div
                        exit={{ y: 16, opacity: 0, filter: "blur(2px)" }}
                        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                        initial={{ y: 16, opacity: 0, filter: "blur(2px)" }}
                    >
                        <SearchNav
                            handler={() => setSearchActive((prevState) => true)}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
            <div
                style={{
                    pointerEvents: searchActive ? "auto" : "none",
                }}
            >
                <AnimatePresence>
                    {searchActive && (
                        <motion.div
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className={style.searchActiveWrap}
                        >
                            <SearchActive
                                searchType={searchType}
                                setSearchType={setSearchType}
                                listSet={listSet}
                                listCollection={listCollection}
                                handler={() =>
                                    setSearchActive((prevState) => false)
                                }
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default SearchBarContent;
