import fetchExistingCards from "@/app/_actions/fetchExistingCards";
import CardsTable from "./cardsTable";
import CreateCard from "../createCard";
import { filterCollection } from "@/app/_actions/filterColection";
import style from "./cardsTable.module.scss";
import ReviseCards from "@/app/_components/reviseCards/reviseCards";
import { fetchSet } from "@/app/_actions/fetchSet";
import { auth } from "@/auth";
import { fetchTagsInCollection } from "@/app/_actions/fetchTagsInCollection";
import { FetchCollectionSetCount } from "@/app/_actions/fetchCollectionSetCount";
import { fetchItemsFromSets } from "@/app/_actions/fetchItemsFromSets";

async function page({ searchParams }: { searchParams: { id: string } }) {
    const setId = searchParams.id;
    const cardCollection = await fetchExistingCards(setId);
    const initialSet = await fetchSet(setId);
    const session = await auth();
    if (!session) return;
    const fetchTags = await fetchTagsInCollection(session.user.id);
    const fetchCollectionCount = await FetchCollectionSetCount({
        userId: session.user.id,
        setNotEmpty: false,
    });

    const initialItems = await fetchItemsFromSets({ setIds: [setId] });

    if (!cardCollection) {
        return (
            <section>
                <div>no cards...</div>
            </section>
        );
    }

    const tags = await filterCollection(searchParams.id);
    let tagArray = [];
    if (tags) {
        tagArray = tags.map((tag) => {
            return tag.tag;
        });
    }

    return (
        <section>
            <div className={style.overflowWrapper}>
                {cardCollection && (
                    <CardsTable
                        cardCollection={cardCollection}
                        tagArray={tagArray}
                    />
                )}
            </div>
            <CreateCard setId={searchParams.id} />
            {fetchTags && fetchCollectionCount && initialItems && (
                <ReviseCards
                    initialSet={initialSet}
                    initialItems={initialItems}
                    collectionSet={fetchCollectionCount}
                    tagsCollection={fetchTags}
                />
            )}
        </section>
    );
}

export default page;
