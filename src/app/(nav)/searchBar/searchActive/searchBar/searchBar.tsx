import React, {
    ChangeEvent,
    Dispatch,
    KeyboardEvent,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "../searchActive.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiCog6Tooth, HiMagnifyingGlass } from "react-icons/hi2";
import CornerClose from "@/app/_components/cornerClose/cornerClose";
import { AnimatePresence, motion } from "framer-motion";
import ModalAbsolute from "@/app/_components/modalAbsolute/modalAbsolute";
import { useRouter } from "next/navigation";
import { colours } from "@/app/styles/colours";

type SearchBarTypes = {
    searchType: string;
    setSearchType: Dispatch<SetStateAction<string>>;
    handler: () => void;
    setSearchText: Dispatch<SetStateAction<string[] | null>>;
};

function InputSearchBar({
    searchType,
    setSearchType,
    handler,
    setSearchText,
}: SearchBarTypes) {
    const router = useRouter();
    const [searchSetting, setSearchSetting] = useState<boolean>(false);
    const searchBarRef = useRef<HTMLInputElement>(null);

    const searchInputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchText(e.target.value.split(" ").filter((text) => text !== ""));
    };

    const searchSettingslist = ["All", "Sets", "Collection", "User"];

    useEffect(() => {
        if (searchBarRef.current) {
            searchBarRef.current.focus();
        }
    }, [searchBarRef]);

    const searchBarSubmitHandler = () => {
        if (searchBarRef.current) {
            const searchQuery = searchBarRef.current.value;
            router.push(
                `/discover?search=${searchQuery}${
                    searchType !== "All"
                        ? `&type=${searchType.toLowerCase()}`
                        : ""
                }`
            );
            handler();
        }
    };

    const keyPressEnterHandler = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
            searchBarSubmitHandler();
        }
    };

    return (
        <section className={style.searchBarContainer}>
            <input
                ref={searchBarRef}
                onChange={searchInputChangeHandler}
                onKeyDown={keyPressEnterHandler}
                className={style.searchTextInput}
                type="text"
                placeholder="search"
            ></input>
            <div>
                <DefaultButton
                    handler={searchBarSubmitHandler}
                    variant="yellow"
                >
                    <span>Search</span>
                    <HiMagnifyingGlass />
                </DefaultButton>
            </div>
            <div className={style.searchSettingsConatiner}>
                <div
                    style={{ pointerEvents: searchSetting ? "none" : "unset" }}
                >
                    <DefaultButton handler={() => setSearchSetting(true)}>
                        <div className={style.settingText}>
                            <label>search</label>
                            <span>{searchType}</span>
                        </div>
                        <HiCog6Tooth />
                    </DefaultButton>
                </div>
                <AnimatePresence>
                    {searchSetting && (
                        <motion.div
                            exit={{ y: -16, opacity: 0 }}
                            initial={{ y: -16, opacity: 0, x: "-50%" }}
                            animate={{ y: 0, opacity: 1 }}
                            className={style.searchSettingPopover}
                        >
                            <ModalAbsolute setModalState={setSearchSetting}>
                                <ul>
                                    {searchSettingslist.map((item) => {
                                        return (
                                            <li
                                                style={{
                                                    backgroundColor:
                                                        item === searchType
                                                            ? colours.grey()
                                                            : "",
                                                }}
                                                onClick={() =>
                                                    setSearchType(item)
                                                }
                                                key={`search-setting-${item}`}
                                            >
                                                {item}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </ModalAbsolute>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <CornerClose type="withinCorner" handler={handler} />
        </section>
    );
}

export default InputSearchBar;
