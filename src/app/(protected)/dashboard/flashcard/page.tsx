import { db } from "@/app/_lib/db";
import style from "./set.module.scss";
import { Flashcard_item, Flashcard_set } from "@/app/_types/types";
import CreateCard from "./createCard";
import ReviseCard from "./reviseCard";
import { HiMiniStop } from "react-icons/hi2";
import LinkText from "@/app/_components/linkText/linkText";

async function page({ searchParams }: any) {
    console.log(searchParams);
    const setId = searchParams.id;

    const existingCards = (await db`
        SELECT * FROM flashcard_item
        WHERE set_id = ${setId}
        ORDER BY last_modified DESC
        LIMIT 5
    `) as Flashcard_item[];

    const existingSetSearch = await db`
        SELECT * FROM flashcard_set
        WHERE id = ${setId}
    `;

    const existingSet = existingSetSearch[0] as Flashcard_set;

    return (
        <section className={style.setContainer}>
            <h3>{existingSet.set_name}</h3>
            {existingCards.length > 0 ? (
                <div className={style.cardsContainer}>
                    {existingCards.map((card, index) => {
                        return (
                            <div className={style.cardItem} key={index}>
                                <div
                                    className={`
                                        ${style.difficulty}
                                        ${card.difficulty === "NA" && style.na}
                                        ${
                                            card.difficulty === "EASY" &&
                                            style.easy
                                        }
                                        ${
                                            card.difficulty === "MEDIUM" &&
                                            style.medium
                                        }
                                        ${
                                            card.difficulty === "HARD" &&
                                            style.hard
                                        }

                                    `}
                                >
                                    <HiMiniStop />
                                </div>
                                <h6>{card.item_question}</h6>
                                <div className={style.tagsContainer}>
                                    {card.item_tags.map((tag, index) => {
                                        return <p key={index}>{tag}</p>;
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>No flash cards currently made</div>
            )}
            <LinkText
                text="See all/edit"
                link={`/dashboard/flashcard/collection?id=${setId}`}
            />
            <CreateCard setId={setId} />
            <ReviseCard />
        </section>
    );
}

export default page;
