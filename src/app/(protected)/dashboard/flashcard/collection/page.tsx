import fetchExistingCards from "@/app/_actions/fetchExistingCards";
import CardsTable from "./cardsTable";
import CreateCard from "../createCard";
import { filterCollection } from "@/app/_actions/filterColection";

async function page({ searchParams }: { searchParams: { id: string } }) {
    const cardCollection = await fetchExistingCards(searchParams.id);

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
    console.log(tagArray);

    return (
        <section>
            <div>
                {cardCollection && (
                    <CardsTable
                        cardCollection={cardCollection}
                        tagArray={tagArray}
                    />
                )}
            </div>
            <CreateCard setId={searchParams.id} />
        </section>
    );
}

export default page;
