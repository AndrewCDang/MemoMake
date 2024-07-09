import fetchExistingCards from "@/app/_actions/fetchExistingCards";
import CardsTable from "./cardsTable";
import CreateCard from "./createCard";
import { filterCollection } from "@/app/_actions/filterColection";
import style from "./cardsTable.module.scss";
import ReviseCards from "@/app/_components/reviseCollection/reviseCards";
import { fetchSet } from "@/app/_actions/fetchSet";
import { auth } from "@/auth";
import { fetchTagsInCollection } from "@/app/_actions/fetchTagsInCollection";
import { FetchCollectionSetCount } from "@/app/_actions/fetchCollectionSetCount";
import { fetchItemsFromSets } from "@/app/_actions/fetchItemsFromSets";
import SliderToggle from "@/app/_components/sliderToggle/sliderToggle";
import { toggleSetPublicAccess } from "@/app/_actions/toggleSetPublicAccess";
import PublicAccessBtn from "../(components)/publicAccessBtn";
import TablePageBtns from "../(components)/TablePageBtns/tablePageBtns";
import EditHeading from "./heading/editHeading";

async function page({ params }: { params: { id: string } }) {
    const setId = params.id;
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

    const tags = await filterCollection(setId);
    let tagArray = [];
    if (tags) {
        tagArray = tags.map((tag) => {
            return tag.tag;
        });
    }

    if (initialSet && fetchCollectionCount)
        return (
            <section>
                <EditHeading set={initialSet} />
                <div className={style.overflowWrapper}>
                    {cardCollection && (
                        <CardsTable
                            cardCollection={cardCollection}
                            tagArray={tagArray}
                        />
                    )}
                </div>
                <TablePageBtns
                    set={initialSet}
                    setId={initialSet.id}
                    collectionSet={fetchCollectionCount}
                    session={session}
                />
            </section>
        );
}

export default page;
