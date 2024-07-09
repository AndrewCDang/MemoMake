import React from "react";
import style from "./page.module.scss";
import { fetchPublicFlashsets } from "../_actions/fetchPublicFlashsets";
import SetAndCollectionCard from "../_components/setAndCollectionCard/setAndCollectionCard";
import { auth } from "@/auth";
import { fetchAccountFromUserId } from "../_actions/fetchAccountFromUserId";
import { Account } from "next-auth";
import UploadImage from "../_components/uploadImage/uploadImage";

async function page({ searchParams }: { searchParams: any }) {
    const searchQuery = searchParams.search as string;
    const searchType = searchParams.type;
    console.log(searchParams);
    console.log(searchParams.type);
    const session = await auth();

    const userAccount = session
        ? await fetchAccountFromUserId({ id: session.user.id })
        : undefined;

    console.log(searchQuery);
    const fetch = searchQuery
        ? await fetchPublicFlashsets({ searchQuery })
        : [];

    console.log(fetch);
    return (
        <main>
            <section>
                <h6>{searchQuery || "Discover"}</h6>
                {searchType && <div>{searchType}</div>}
            </section>
            <section className={style.setGrid}>
                {fetch &&
                    fetch.length &&
                    fetch.map((item) => {
                        return (
                            <SetAndCollectionCard
                                set={item}
                                account={userAccount}
                                contentType="set"
                                originalId={item.id}
                            />
                        );
                    })}
            </section>
        </main>
    );
}

export default page;
