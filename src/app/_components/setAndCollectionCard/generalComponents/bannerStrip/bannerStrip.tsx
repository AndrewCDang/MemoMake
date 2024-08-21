import React, {
    Dispatch,
    ReactNode,
    SetStateAction,
    useEffect,
    useMemo,
    useState,
} from "react";
import style from "./bannerStrip.module.scss";
import { CollectionIcon, SetIcon } from "@/app/_components/svgs/svgs";
import {
    AnimatePresence,
    motion,
    useMotionTemplate,
    useMotionValue,
    useSpring,
} from "framer-motion";
import { AiFillPushpin } from "react-icons/ai";
import { Account } from "@/app/_types/types";
import { Flashcard_set } from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import { spring } from "@/app/_components/framerMotion/springTransition";
import { colours } from "@/app/styles/colours";
import { BannerIcon } from "../bannerBtns/bannerBtns";
import { IoMdThumbsUp } from "react-icons/io";
import { addRemoveFavourites } from "@/app/_actions/addRemoveFavourites";
import { addRemoveLike } from "@/app/_actions/addRemoveLike";

const MotionIconContainer = ({
    children,
    publicCard,
    themeColour,
    iconBoxShadows,
    highlight,
    handler,
}: {
    children: ReactNode;
    publicCard: boolean;
    themeColour: string;
    iconBoxShadows: string;
    handler: () => void;

    highlight: boolean;
}) => {
    return (
        <motion.div
            onClick={handler}
            className={`${style.bannerIcon} ${
                highlight && style.bannerIconSelected
            } foregroundContainer2`}
            style={{
                backgroundColor: publicCard ? colours.white() : themeColour,
                boxShadow: iconBoxShadows,
            }}
            initial={{
                y: 10,
                opacity: 0,
                scale: 0.9,
            }}
            animate={{
                y: 0,
                opacity: 1,
                scale: 1,
            }}
            exit={{ y: 10, opacity: 0, scale: 0.9 }}
            transition={spring}
        >
            {children}
        </motion.div>
    );
};

const IconContainer = ({
    children,
    themeColour,
    iconBoxShadows,
}: {
    children: ReactNode;
    themeColour: string;
    iconBoxShadows: string;
}) => {
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

function BannerStrip({
    set,
    account,
    contentType,
    isFavourited,
    setIsFavourited,
    setIsLiked,
    isLiked,
    themeColour,
}: {
    contentType: "collection" | "set";
    account: Account | undefined;
    set: Flashcard_collection_set_joined | Flashcard_set;
    isFavourited: boolean;
    setIsFavourited: Dispatch<SetStateAction<boolean>>;
    setIsLiked: Dispatch<SetStateAction<boolean>>;
    isLiked: boolean;
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
        if (
            set.public_access === true &&
            account &&
            account.user_id !== set.user_id
        )
            conditions += 1;
        // if (account && account.user_id !== set.user_id) conditions += 1;

        console.log(conditions * iconSize);
        return conditions * iconSize - bannerRadius;
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
    }, [isFavourited, isLiked]);

    // Box Shadow - icons
    const iconBoxShadows = `0px 2px 4px rgba(0,0,0,0.2)`;

    const ForegroundContainer = () => {
        if (contentType === "set") {
            return <div className={style.foregroundContainer}></div>;
        } else if (contentType === "collection") {
            return (
                <div className={style.backgroundCollectionContainerWrap}>
                    <motion.div
                        layout
                        style={{
                            clipPath: newPathD,
                            backgroundColor: colours.white(),
                        }}
                        className={style.backgroundCollectionContainer}
                    ></motion.div>
                </div>
            );
        }
        return null;
    };

    const pinHandler = async () => {
        setIsFavourited(false);
        if (account) {
            const favouriteDb = await addRemoveFavourites({
                id: account.user_id,
                setId: set.id,
                revalidate: false,
            });
        }
    };

    const getPinIcon = () => {
        if (isFavourited) {
            return (
                <MotionIconContainer
                    handler={pinHandler}
                    highlight={false}
                    publicCard={publicCard}
                    iconBoxShadows={iconBoxShadows}
                    themeColour={"white"}
                >
                    <AiFillPushpin
                        style={{
                            fill: isFavourited
                                ? colours.blueSelect()
                                : colours.grey(),
                        }}
                    />
                </MotionIconContainer>
            );
        }
    };

    const likeHandler = async () => {
        setIsLiked((prevState) => !prevState);
        if (account) {
            const favouriteDb = await addRemoveLike({
                id: account.user_id,
                setId: set.id,
                revalidate: false,
                contentType: contentType,
            });
        }
    };

    const initialLiked = useMemo(() => isLiked, []);

    const getLikeCount = useMemo(() => {
        if (isLiked === initialLiked) return set.like_count;
        if (isLiked !== initialLiked) {
            if (initialLiked) {
                return Number(set.like_count) - 1;
            } else {
                return Number(set.like_count) + 1;
            }
        }
        return undefined;
    }, [isLiked]);

    const getLikeIcon = () => {
        if (account && set.public_access && account.user_id !== set.user_id) {
            return (
                <MotionIconContainer
                    handler={likeHandler}
                    highlight={isLiked}
                    publicCard={publicCard}
                    iconBoxShadows={iconBoxShadows}
                    themeColour={"white"}
                >
                    <div
                        className={`${style.iconLikedContent} ${
                            isLiked && style.isLiked
                        }`}
                    >
                        <span>{getLikeCount}</span>
                        <IoMdThumbsUp />
                    </div>
                </MotionIconContainer>
            );
        }
        return undefined;
    };

    type BannerContentType = "pinIcon" | "likeIcon";
    const bannerArray: {
        name: BannerContentType;
        content: React.JSX.Element | undefined;
    }[] = [
        { name: "pinIcon" as BannerContentType, content: getPinIcon() },
        { name: "likeIcon" as BannerContentType, content: getLikeIcon() },
    ].filter((item) => item.content && item);

    const hoverTextForIcon = (item: BannerContentType) => {
        if (item === "likeIcon") {
            if (isLiked) {
                return "Unlike";
            } else {
                return "Like";
            }
        }
        if (item === "pinIcon") {
            if (isFavourited) {
                return "Unpin";
            }
        }
        return "";
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
                                hoverText={set.creator.user_name || "OC"}
                            >
                                <IconContainer
                                    iconBoxShadows={iconBoxShadows}
                                    themeColour={themeColour}
                                >
                                    <img
                                        src={set.creator.image}
                                        className={style.bannerProfileImage}
                                        alt=""
                                    ></img>
                                </IconContainer>
                            </BannerIcon>
                        )}
                        <AnimatePresence initial={false} mode="popLayout">
                            {bannerArray.map((item, i) => (
                                <BannerIcon
                                    key={item.name}
                                    hoverText={hoverTextForIcon(item.name)}
                                    handler={() => null}
                                >
                                    <motion.div
                                        transition={{
                                            stiffness: 800,
                                            damping: 10,
                                            mass: 1,
                                        }}
                                        layout
                                    >
                                        {item.content}
                                    </motion.div>
                                </BannerIcon>
                            ))}
                        </AnimatePresence>
                    </section>
                </div>
            </div>
            {/* Bg for collection item */}
            {contentType === "collection" && <ForegroundContainer />}
            {/* Bg for set/collection item */}
            <div
                className={`${style.backgroundContainerWrap} foregroundContainer`}
            >
                <motion.div
                    style={{
                        clipPath: newPathD,
                        backgroundColor: publicCard
                            ? colours.white()
                            : contentType === "collection"
                            ? themeColour
                            : colours.white(),
                    }}
                    className={style.backgroundContainer}
                >
                    {contentType === "set" && (
                        <div className={style.foregroundContainerWrap}>
                            <div className={style.foregroundContainer}></div>
                        </div>
                    )}
                </motion.div>
            </div>
        </>
    );
}

export default BannerStrip;
