import fetchExistingCards from "@/app/_lib/fetch/fetchExistingCards";
import CardsTable from "./cardsTable";
import { filterCollection } from "@/app/_actions/filterColection";
import style from "./cardsTable.module.scss";
import { fetchSet } from "@/app/_lib/fetch/fetchSet";
import { auth } from "@/auth";
import { fetchCollectionSetCount } from "@/app/_lib/fetch/fetchCollectionSetCount";
import TablePageBtns from "../(components)/TablePageBtns/tablePageBtns";
import EditHeading from "./heading/editHeading";

async function page({ params }: { params: { id: string } }) {
    const setId = params.id;
    const cardCollection = await fetchExistingCards(setId);
    const initialSet = await fetchSet(setId);
    const session = await auth();
    if (!session) return;

    const fetchCollectionCount = await fetchCollectionSetCount({
        userId: session.user.id,
        setNotEmpty: false,
    });

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
