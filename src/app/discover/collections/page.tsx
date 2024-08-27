import { fetchAccountFromUserId } from "@/app/_lib/fetch/fetchAccountFromUserId";
import { fetchPublicFlashsets } from "@/app/_lib/fetch/fetchPublicFlashsets";
import SectionTemplate from "@/app/_components/setCollectionContentSection/sectionTemplate";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { auth } from "@/auth";
import React from "react";
import { fetchPublicFlashCollections } from "@/app/_lib/fetch/fetchPublicFlashCollections";

async function Page({ searchParams }: { searchParams: any }) {
    const searchQuery = searchParams.search as string;
    const searchPage = searchParams.page || ("1" as string);
    const session = await auth();
    const itemsPerPage = 18;

    const userAccount = session
        ? await fetchAccountFromUserId({ id: session.user.id })
        : undefined;

    const fetchCollection = searchQuery
        ? await fetchPublicFlashCollections({
              searchQuery,
              itemsPerPage: itemsPerPage,
              paginate: true,
              pageNum: Number(searchPage),
          })
        : undefined;

    return (
        <SectionTemplate
            createBtn={false}
            filter={true}
            id="discover-collection-flashcards"
            content={(fetchCollection && fetchCollection.fetched_items) || []}
            title={`Flash Card Collections for '${capitaliseFirstChar(
                searchQuery
            )}'`}
            account={userAccount}
            contentType="collection"
            totalPaginationItems={fetchCollection?.total_count || null}
            totalItemsPerPage={itemsPerPage}
            paginationLink={
                searchQuery
                    ? `/discover/collections?search=${searchQuery}`
                    : null
            }
            currentPagPage={Number(searchPage)}
        />
    );
}

export default Page;
