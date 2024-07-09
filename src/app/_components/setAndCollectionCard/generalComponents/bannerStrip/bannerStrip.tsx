import React, { ReactNode, useEffect } from "react";
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
import { colours } from "@/app/styles/colours";
import { BannerIcon } from "../bannerBtns/bannerBtns";

function BannerStrip({
    set,
    account,
    contentType,
    isFavourited,
    themeColour,
}: {
    contentType: "collection" | "set";
    account: Account | undefined;
    set: Flashcard_collection_set_joined | Flashcard_set;
    isFavourited: boolean;
    themeColour: string;
}) {
    // Card not created by user
    const publicCard =
        account && account.user_id !== set.user_id ? true : false;

    // Controls gap per number of icons on top left banner
    const bannerRadius = 20;
    const defaultBannerSpacing = () => {
        const iconSize = 40;
        let conditions = 1;

        if (isFavourited) conditions += 1;
        if (publicCard) conditions -= 1;

        return bannerRadius + conditions * iconSize;
    };
    const pathValue = useMotionValue(defaultBannerSpacing());
    const pathGap = useSpring(pathValue, spring);
    const pathGapBtm = useSpring(pathValue.get() + bannerRadius, spring);
    const pathGapEnd = useSpring(pathValue.get() + 2 * bannerRadius, spring);

    const newPathD = useMotionTemplate`path("M0 64 Q0 40 16 40 L${pathGap} 40  Q${pathGapBtm} 40 ${pathGapBtm} 16 Q${pathGapBtm} 0 ${pathGapEnd} 0 H10000 V10000 H0 Z")`;

    const pathGapHandler = () => {
        const spacing = defaultBannerSpacing();
        pathValue.set(spacing);
        pathGapBtm.set(spacing + bannerRadius);
        pathGapEnd.set(spacing + 2 * bannerRadius);
    };

    useEffect(() => {
        pathGapHandler();
    }, [isFavourited]);

    // Box Shadow - icons
    const iconBoxShadows = `0px 2px 4px rgba(0,0,0,0.2)`;

    const ForegroundContainer = () => {
        if (contentType === "set") {
            return <div className={style.foregroundContainer}></div>;
        } else if (contentType === "collection") {
            return (
                <motion.div
                    style={{
                        clipPath: newPathD,
                        backgroundColor: colours.white(),
                        // boxShadow: `6px 6px 0px rgba(0,0,0,0.4), 6px 6px 0px ${themeColour}`,
                    }}
                    className={style.backgroundCollectionContainer}
                ></motion.div>
            );
        }
        return null;
    };

    const IconContainer = ({ children }: { children: ReactNode }) => {
        return (
            <div
                className={`${style.bannerIcon} foregroundContainer2`}
                style={{
                    backgroundColor: themeColour,
                    boxShadow: iconBoxShadows,
                }}
            >
                {children}
            </div>
        );
    };

    return (
        <>
            <div onClick={pathGapHandler} className={style.bannerContainer}>
                <div className={style.bannerInternal}>
                    <section className={style.iconContainer}>
                        {!publicCard && contentType && (
                            <div
                                className={`${style.bannerIcon} foregroundContainer2`}
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
                        {publicCard && (
                            <BannerIcon
                                handler={() => null}
                                hoverText={set.creator.user_name || "test"}
                            >
                                <IconContainer>
                                    <img
                                        src={set.creator.image}
                                        className={style.bannerProfileImage}
                                        alt=""
                                    ></img>
                                </IconContainer>
                            </BannerIcon>
                        )}
                        {account && (
                            <AnimatePresence initial={false}>
                                {isFavourited && (
                                    <motion.div
                                        className={`${style.bannerIcon} foregroundContainer2`}
                                        style={{
                                            backgroundColor: publicCard
                                                ? colours.white()
                                                : themeColour,
                                            boxShadow: iconBoxShadows,
                                        }}
                                        initial={{
                                            y: 10,
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        animate={{ y: 0, opacity: 1, scale: 1 }}
                                        exit={{ y: 10, opacity: 0, scale: 0.9 }}
                                        transition={spring}
                                    >
                                        <AiFillPushpin />
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        )}
                    </section>
                </div>
            </div>
            <ForegroundContainer />
            <div
                className={`${style.backgroundContainerWrap} foregroundContainer`}
            >
                <motion.div
                    style={{
                        clipPath: newPathD,
                        backgroundColor: publicCard
                            ? colours.white()
                            : themeColour,
                        // boxShadow: `6px 6px 0px rgba(0,0,0,0.4), 6px 6px 0px ${themeColour}`,
                    }}
                    className={style.backgroundContainer}
                >
                    {/* <img src={set.image} alt={``}></img> */}
                </motion.div>
            </div>
        </>
    );
}

export default BannerStrip;
