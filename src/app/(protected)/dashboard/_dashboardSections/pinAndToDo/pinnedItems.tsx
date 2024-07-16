import React, { useState } from "react";
import style from "./pinAndToDo.module.scss";
import {
    Account,
    Flashcard_collection,
    Flashcard_set,
} from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet";
import { BannerIcon } from "@/app/_components/setAndCollectionCard/generalComponents/bannerBtns/bannerBtns";
import PinIcon from "@/app/_components/_generalUi/pinIcon/pinIcon";
import { HiChevronRight } from "react-icons/hi2";
import Link from "next/link";

type PinnedItemsTypes = {
    itemsArray: {
        contentType: "collection" | "set";
        array: Flashcard_set[] | Flashcard_collection_set_joined[];
    }[];
    account: Account;
};

function PinnedItems({ itemsArray, account }: PinnedItemsTypes) {
    console.log(itemsArray);
    // Favourite state
    const [favouriteItems, setFavouriteItems] = useState<string[]>(
        account?.favourites || []
    );

    const favouriteHandler = (id: string) => {
        setFavouriteItems((prevState) => {
            if (prevState.includes(id)) {
                const removedArray = prevState.filter((item) => item !== id);
                return removedArray;
            } else {
                return [...prevState, id];
            }
        });
    };

    const PinIconComponent = ({ id }: { id: string }) => {
        return (
            <BannerIcon
                hoverText={favouriteItems.includes(id) ? "Unpin" : "Pin"}
                handler={() => favouriteHandler(id)}
                hoverPos="left"
            >
                <PinIcon
                    favourited={favouriteItems.includes(id)}
                    userId={account && account.user_id}
                    setId={id}
                    revalidate={false}
                />
            </BannerIcon>
        );
    };

    return (
        <div className={style.asideContainer}>
            <h6>Pinned Items</h6>
            <div className={style.pinItemsContainer}>
                {itemsArray &&
                    itemsArray.map((item) => {
                        if (item.contentType === "collection") {
                            const pinItem =
                                item.array as Flashcard_collection[];
                            return pinItem.map((pinItem) => {
                                return (
                                    <div
                                        className={style.pinItem}
                                        key={`pin_item-${pinItem.id}`}
                                    >
                                        <div className={style.leftSection}>
                                            <PinIconComponent id={pinItem.id} />
                                            <span>
                                                {pinItem.collection_name}
                                            </span>
                                        </div>
                                        <div className={style.rightSvg}>
                                            <HiChevronRight />
                                        </div>
                                    </div>
                                );
                            });
                        } else if (item.contentType === "set") {
                            const pinItem = item.array as Flashcard_set[];
                            return pinItem.map((pinItem) => {
                                return (
                                    <div
                                        className={style.pinItem}
                                        key={`pin_item-${pinItem.id}`}
                                    >
                                        <div className={style.leftSection}>
                                            <PinIconComponent id={pinItem.id} />
                                            <span>{pinItem.set_name}</span>
                                        </div>
                                        <div className={style.rightSvg}>
                                            <HiChevronRight />
                                        </div>
                                        <Link
                                            className={style.clickWrap}
                                            href={`/dashboard/edit/${pinItem.id}`}
                                        ></Link>
                                    </div>
                                );
                            });
                        }
                        return null;
                    })}
            </div>
        </div>
    );
}

export default PinnedItems;
