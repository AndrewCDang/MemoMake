"use client";
import React, { ReactNode, useState } from "react";
import style from "./tablePageBtns.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiViewGridAdd } from "react-icons/hi";
import CreateCardModal from "../../[id]/(components)/createCardModal";
import Modal from "@/app/_components/modal/modal";
import { Flashcard_set } from "@/app/_types/types";
import { Session } from "next-auth";
import StudyBtn from "@/app/_components/setAndCollectionCard/generalComponents/previewEditStudyBtns/studyBtn/studyBtn";
import { Flashcard_collection_set_joined } from "@/app/_lib/fetch/fetchCollectionByIdJoinSet";
import ReviseModal from "@/app/_components/reviseCollection/reviseModal";

function TablePageBtns({
    set,
    setId,
    session,
}: {
    set: Flashcard_set | Flashcard_collection_set_joined;
    setId: string;
    // collectionSet: Flashcard_set_with_count[];
    session: Session;
}) {
    const [toggleCreate, setToggleCreate] = useState<boolean>(false);

    const CardStyle = ({ children }: { children: ReactNode }) => {
        return <div className={style.pageBtn}>{children}</div>;
    };

    return (
        <>
            <aside className={style.tablePageBtns}>
                <DefaultButton
                    border="thick"
                    variant="White"
                    handler={() => setToggleCreate(true)}
                >
                    <CardStyle>
                        <span>Create Card</span>
                        <HiViewGridAdd />
                    </CardStyle>
                </DefaultButton>
                <CardStyle>
                    <StudyBtn set={set} contentType="set" />
                </CardStyle>
            </aside>
            <Modal
                modalOn={toggleCreate}
                closeHandler={() => setToggleCreate(false)}
                modalTitle="New Flash Card"
            >
                <CreateCardModal setId={setId} userId={session.user.id} />
            </Modal>
            <ReviseModal session={session} contentType={"set"} />
        </>
    );
}

export default TablePageBtns;
