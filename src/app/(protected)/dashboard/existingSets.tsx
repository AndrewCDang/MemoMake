import React from "react";
import { Session } from "next-auth";
import { db } from "@/app/_lib/db";
import { Flashcard_set } from "@/app/_types/types";
import style from "./existingSets.module.scss";
import { HiArrowRightCircle } from "react-icons/hi2";
import Link from "next/link";

async function ExistingSets({ session }: { session: Session | null }) {
    if (!session) return null;

    const searchExistingSets = (await db`
            SELECT * FROM flashcard_set
            WHERE user_id = ${session.user.id}
        `) as Flashcard_set[];

    console.log(searchExistingSets);
    return (
        <section className={style.setGrid}>
            {searchExistingSets &&
                searchExistingSets.map((set, index) => {
                    return (
                        <Link
                            key={index}
                            href={`dashboard/flashcard?id=${set.id}`}
                        >
                            <section className={style.setContainer}>
                                <div className={style.setContent}>
                                    <h4>{set.set_name}</h4>
                                    <div className={style.categoryContainer}>
                                        {set.set_categories.map(
                                            (category, index) => {
                                                return (
                                                    <label key={index}>
                                                        {category}
                                                    </label>
                                                );
                                            }
                                        )}
                                    </div>
                                    {set.description && (
                                        <p>{set.description}</p>
                                    )}
                                </div>
                                <div className={style.viewSet}>
                                    <p>View Set</p>
                                    <HiArrowRightCircle />
                                </div>
                            </section>
                        </Link>
                    );
                })}
        </section>
    );
}

export default ExistingSets;
