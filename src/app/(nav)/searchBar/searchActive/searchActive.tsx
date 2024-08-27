import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import style from "./searchActive.module.scss";
import { motion } from "framer-motion";
import React, {
    ChangeEvent,
    Dispatch,
    FormEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import SearchDashboard from "./searchDashboard/searchDashboard";
import {
    Flashcard_collection_with_count,
    Flashcard_set_with_count,
} from "@/app/_types/types";
import { searchByOptions, subjects } from "./webpageContent/webpageContent";
import InputSearchBar from "./searchBar/searchBar";
import { removeDuplicates } from "@/app/_functions/removeDuplicates";
import Link from "next/link";

type SearchActiveTypes = {
    searchType: string;
    setSearchType: Dispatch<SetStateAction<string>>;
    handler: () => void;
    listSet: Flashcard_set_with_count[];
    listCollection: Flashcard_collection_with_count[];
};

export type ListItemWithMatch<t> = t & {
    matches: number;
};

function SearchActive({
    searchType,
    setSearchType,
    handler,
    listSet,
    listCollection,
}: SearchActiveTypes) {
    // Modal state
    const activeSearchRef = useRef<HTMLFormElement>(null);
    const activeSearchClick = (e: MouseEvent | TouchEvent) => {
        if (
            activeSearchRef.current &&
            !activeSearchRef.current.contains(e.target as Node)
        ) {
            handler();
            console.log("clickoutside");
        }
    };

    useEffect(() => {
        if (activeSearchRef.current) {
            window.addEventListener("mouseup", activeSearchClick);
            window.addEventListener("touchend", activeSearchClick);

            return () => {
                if (activeSearchRef.current) {
                    window.removeEventListener("mouseup", activeSearchClick);
                    window.removeEventListener("touchend", activeSearchClick);
                }
            };
        }
    }, [activeSearchRef]);

    // searchbar
    const [searchText, setSearchText] = useState<string[] | null>(null);

    const searchHandler = (e: FormEvent) => {
        e.preventDefault();
    };

    return (
        <motion.form
            onSubmit={searchHandler}
            ref={activeSearchRef}
            initial={{
                y: -24,
                opacity: 0,
                x: "-50%",
                rotateX: "-135deg",
                rotateY: "-135deg",
            }}
            animate={{
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                rotateX: "0deg",
                rotateY: "0deg",
            }}
            exit={{
                y: -24,
                opacity: 0,
                filter: "blur(4px)",
                rotateX: "135deg",
                rotateY: "135deg",
            }}
            transition={{
                type: "spring",
                stiffness: 100,
                damping: 15,
                mass: 0.1,
            }}
            className={style.activeSearchBarContainer}
        >
            <InputSearchBar
                searchType={searchType}
                setSearchType={setSearchType}
                handler={handler}
                setSearchText={setSearchText}
            />
            <section className={style.subjectsContainer}>
                <div className={style.subjectGroup}>
                    {searchByOptions.map((item, index) => {
                        return (
                            <DefaultButton
                                key={`${item}-search-${index}`}
                                outline={false}
                            >
                                {item}
                            </DefaultButton>
                        );
                    })}
                </div>
                <div className={style.subjectGroup}>
                    <label className={style.subheading}>
                        Topics of the day
                    </label>
                    {subjects.map((item, index) => {
                        return (
                            <Link
                                href={`/discover?search=${item}`}
                                key={`${item}-search-suggestion-${index}`}
                            >
                                <DefaultButton
                                    handler={handler}
                                    outline={false}
                                >
                                    {item}
                                </DefaultButton>
                            </Link>
                        );
                    })}
                </div>
            </section>
            <SearchDashboard
                searchText={removeDuplicates(searchText || [])}
                listSet={listSet}
                listCollection={listCollection}
            />
        </motion.form>
    );
}

export default SearchActive;
