import { filterCollection } from "@/app/_actions/filterColection";
import style from "./(components)/cardsTable.module.scss";
import { auth } from "@/auth";
import TablePageBtns from "../(components)/TablePageBtns/tablePageBtns";
import EditHeading from "./heading/editHeading";
import { fetchSetsWithItems } from "@/app/_lib/fetch/fetchSetsWithItems";
import { Flashcard_set_with_cards } from "@/app/_types/types";
import EditPageContent from "./editPageContent";
import { redirect } from "next/navigation";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Quizmu | Edit Set",
    description: "Edit your Flash Card Set | Create new cards",
};

async function Page({ params }: { params: { id: string } }) {
    const setId = params.id;
    const session = await auth();
    if (!session) {
        redirect("/dashboard");
    }

    const fetchSet = (await fetchSetsWithItems({
        fetchObject: { userId: session.user.id, id: setId, type: "set" },
    })) as Flashcard_set_with_cards[];

    if (!fetchSet[0]) {
        redirect("/dashboard");
    }

    if (session.user.id !== fetchSet[0].user_id) {
        redirect("/dashboard");
    }

    const initialSet = (fetchSet && fetchSet[0]) || null;
    const cardCollection =
        (fetchSet && fetchSet[0].flashcards).filter((item) => item !== null) ||
        [];

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

    if (initialSet && cardCollection)
        return (
            <section className={style.editPageContainer}>
                <EditHeading set={initialSet} />
                <EditPageContent
                    initialSet={initialSet}
                    cardCollection={cardCollection}
                    tagArray={tagArray}
                    session={session}
                />
                <TablePageBtns
                    set={initialSet}
                    setId={initialSet.id}
                    session={session}
                />
            </section>
        );
}

export default Page;
