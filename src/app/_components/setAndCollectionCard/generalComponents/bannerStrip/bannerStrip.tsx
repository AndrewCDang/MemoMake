import React, { useEffect } from "react";
import style from "./bannerStrip.module.scss";
import { CollectionIcon, SetIcon } from "@/app/_components/svgs";
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { AiFillPushpin } from "react-icons/ai";
import { Account, ThemeColour } from "@/app/_types/types";
import { Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { spring } from "@/app/_components/framerMotion/springTransition";

function BannerStrip({
    contentType,
    account,
    set,
    isFavourited,
    themeColour,
}: {
    contentType: "collection" | "set";
    account: Account;
    set: Flashcard_collection_set_joined | Flashcard_set;
    isFavourited: boolean;
    themeColour: string;
}) {
    // Controls gap per number of icons on top left banner
    const bannerRadius = 20;
    const defaultBannerSpacing = () => {
        const iconSize = 40;
        let conditions = 0;
        if (isFavourited) conditions++;

        return conditions * iconSize;
    };
    const pathValue = useMotionValue(bannerRadius + defaultBannerSpacing());
    const pathGap = useSpring(pathValue, spring);
    const pathGapBtm = useSpring(pathValue.get() + bannerRadius, spring);
    const pathGapEnd = useSpring(pathValue.get() + 2 * bannerRadius, spring);

    const newPathD = useMotionTemplate`path("M0 64 Q0 40 16 40 L${pathGap} 40  Q${pathGapBtm} 40 ${pathGapBtm} 16 Q${pathGapBtm} 0 ${pathGapEnd} 0 H10000 V10000 H0 Z")`;

    const pathGapHandler = () => {
        const spacing = bannerRadius + defaultBannerSpacing();
        pathValue.set(spacing);
        pathGapBtm.set(spacing + bannerRadius);
        pathGapEnd.set(spacing + 2 * bannerRadius);
    };

    useEffect(() => {
        pathGapHandler();
    }, [isFavourited]);

    // Box Shadow - icons
    const iconBoxShadows = `1px 2px 1px rgba(0,0,0,0.4)`;

    return (
        <>
            <div onClick={pathGapHandler} className={style.bannerContainer}>
                <div className={style.bannerInternal}>
                    <section className={style.iconContainer}>
                        {contentType && (
                            <div
                                className={style.bannerIcon}
                                style={{
                                    backgroundColor: themeColour,
                                    boxShadow: iconBoxShadows,
                                }}
                            >
                                {contentType === "collection" ? (
                                    <CollectionIcon />
                                ) : contentType === "set" ? (
                                    <SetIcon />
                                ) : null}
                            </div>
                        )}
                        <AnimatePresence initial={false}>
                            {isFavourited && (
                                <motion.div
                                    className={style.bannerIcon}
                                    style={{
                                        backgroundColor: themeColour,
                                        boxShadow: iconBoxShadows,
                                    }}
                                    initial={{ y: 10, opacity: 0, scale: 0.9 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    exit={{ y: 10, opacity: 0, scale: 0.9 }}
                                    transition={spring}
                                >
                                    <AiFillPushpin />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </section>
                </div>
            </div>
            <div className={style.foregroundContainer}></div>
            <motion.div
                style={{
                    clipPath: newPathD,
                    backgroundColor: themeColour,
                    boxShadow: `6px 6px 0px rgba(0,0,0,0.4), 6px 6px 0px ${themeColour}`,
                }}
                className={style.backgroundContainer}
            ></motion.div>
        </>
    );
}

export default BannerStrip;
