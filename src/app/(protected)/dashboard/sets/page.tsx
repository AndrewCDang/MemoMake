import { fetchAccountFromUserId } from "@/app/_lib/fetch/fetchAccountFromUserId";
import SectionTemplate from "@/app/_components/setCollectionContentSection/sectionTemplate";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { auth } from "@/auth";
import React from "react";
import fetchExistingSetsFromId from "@/app/_lib/fetch/fetchExistingSetsFromId";
import { notFound } from "next/navigation";

async function page({ searchParams }: { searchParams: any }) {
    const session = await auth();
    if (!session) return notFound();

    const searchPage = searchParams.page || ("1" as string);

    const itemsPerPage = 18;

    const userAccount = session
        ? await fetchAccountFromUserId({ id: session.user.id })
        : undefined;

    const searchExistingSets = session?.user.id
        ? await fetchExistingSetsFromId({
              userId: session.user.id,
              pageNum: searchPage,
              itemsPerPage: itemsPerPage,
          })
        : null;

    return (
        <SectionTemplate
            createBtn={false}
            filter={true}
            id="discover-sets-flashcards"
            content={
                (searchExistingSets && searchExistingSets.fetched_items) || []
            }
            title={`Your Flashcard Sets`}
            account={userAccount}
            contentType="set"
            totalPaginationItems={searchExistingSets?.total_count || null}
            totalItemsPerPage={itemsPerPage}
            paginationLink={`/dashboard/sets?`}
            currentPagPage={Number(searchPage)}
        />
    );
}

export default page;
