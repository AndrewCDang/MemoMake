import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import {
    AccountWithLikesAndPins,
    ContentType,
    Flashcard_set,
} from "@/app/_types/types";
import React from "react";
import LinkText from "../linkText/linkText";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { CollectionIcon, SetIcon } from "../svgs/svgs";
import style from "./sectionTemplate.module.scss";
import CreateCollectionBtn from "./_dashboardButtons/createCollectionBtn";
import CreateSetBtn from "./_dashboardButtons/createSetBtn";
import Filterbtn from "./_dashboardButtons/filterbtn";
import PaginationBtns from "../_generalUi/paginationBtns/paginationBtns";
import Link from "next/link";
import DefaultButton from "../(buttons)/defaultButton";
import { HiChevronRight } from "react-icons/hi2";
import SetCollectionContainerNeatly from "./setCollectionContainerNeatly";
import { unstable_noStore } from "next/cache";

// Section Template
type SectionTemplateTypes = {
    createBtn: boolean;
    filter: boolean;
    title: string;
    id: string;
    content: Flashcard_set[] | Flashcard_collection_set_joined[];
    contentType: ContentType;
    account: AccountWithLikesAndPins | undefined;
    href?: string | undefined;
    viewBtn?: boolean;
    totalPaginationItems?: number | null;
    totalItemsPerPage?: number;
    paginationLink?: string | null;
    currentPagPage?: number | null;
    publicPage?: boolean;
};

/**
 * Container template holding flashcard sets/collections with optional filter/create btns
 * @param param0
 * @returns
 */

export const SectionTemplate = ({
    createBtn,
    filter,
    title,
    id,
    content,
    contentType,
    account,
    href,
    viewBtn = false,
    totalPaginationItems,
    totalItemsPerPage,
    paginationLink,
    currentPagPage,
    publicPage = false,
}: SectionTemplateTypes) => {
    const totalPagBtns =
        totalItemsPerPage && totalPaginationItems
            ? Math.ceil(totalPaginationItems / totalItemsPerPage)
            : 1;

    return (
        <section id={id} className={style.sectionContainer}>
            <div className={style.sectionTitle}>
                <div className={style.iconAndTitle}>
                    {contentType === "collection" ? (
                        <CollectionIcon />
                    ) : contentType === "set" ? (
                        <SetIcon />
                    ) : null}
                    <h6>{title}</h6>
                </div>
                {createBtn && (
                    <div className={style.sectionBtnGroup}>
                        {contentType === "collection" ? (
                            <CreateCollectionBtn />
                        ) : contentType === "set" ? (
                            <CreateSetBtn />
                        ) : null}
                    </div>
                )}
                {filter && <Filterbtn />}
            </div>
            <SetCollectionContainerNeatly
                account={account}
                content={content}
                contentType={contentType}
                dynamicNeat={viewBtn ? true : false}
                publicPage={publicPage}
            />
            {(href && totalPaginationItems && totalPaginationItems > 12) ||
            (viewBtn && href) ? (
                <>
                    {viewBtn ? (
                        <div className={style.linkContainer}>
                            <span>
                                {totalPaginationItems &&
                                    totalPaginationItems > 12 &&
                                    `More ${capitaliseFirstChar(contentType)}s
                                    available`}
                            </span>
                            <Link href={href}>
                                <DefaultButton variant="yellow">
                                    <span>
                                        View All{" "}
                                        {capitaliseFirstChar(contentType)}s
                                    </span>
                                    <HiChevronRight />
                                </DefaultButton>
                            </Link>
                        </div>
                    ) : (
                        <div className={style.linkContainer}>
                            <LinkText
                                link={href}
                                text={`View all ${capitaliseFirstChar(
                                    contentType
                                )}`}
                            ></LinkText>
                        </div>
                    )}
                </>
            ) : null}
            {viewBtn &&
                totalPaginationItems &&
                totalItemsPerPage &&
                totalPaginationItems < totalItemsPerPage && (
                    <div className={style.linkContainer}>
                        <span>All results shown</span>
                    </div>
                )}

            {!viewBtn && totalPagBtns && paginationLink && currentPagPage && (
                <PaginationBtns
                    url={paginationLink}
                    currentPagPage={currentPagPage}
                    totalPagBtns={totalPagBtns}
                />
            )}
        </section>
    );
};
export default SectionTemplate;
