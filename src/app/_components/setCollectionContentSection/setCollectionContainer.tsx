import style from "./sectionTemplate.module.scss";
import SetAndCollectionCard from "../setAndCollectionCard/setAndCollectionCard";
import {
    AccountWithLikesAndPins,
    ContentType,
    Flashcard_set,
} from "@/app/_types/types";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";

type SetCollectionContainerType = {
    account: AccountWithLikesAndPins | undefined;
    content: Flashcard_collection_set_joined[] | Flashcard_set[];
    contentType: ContentType;
};

/**
 *
 *  Container for set/collection items inside grid
 * @returns React.Node
 */
function SetCollectionContainer({
    account,
    content,
    contentType,
}: SetCollectionContainerType) {
    return (
        <section className={style.setGrid}>
            {content &&
                content.map((item, index) => {
                    return (
                        <SetAndCollectionCard
                            key={index}
                            set={item}
                            account={account}
                            contentType={contentType}
                        />
                    );
                })}
        </section>
    );
}

export default SetCollectionContainer;
