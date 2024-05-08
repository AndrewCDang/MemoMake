"use client";
import Modal from "@/app/_components/modal/modal";
import React from "react";
import CreateCollectionModal from "./createCollectionModal/createCollectionModal";
import { useCreateSetModal } from "./createSetModal/useCreateSetModal";
import { useCreateCollectionModal } from "./createCollectionModal/useCreateCollection";
import { Flashcard_set_with_count } from "@/app/_types/types";
import CreateSetModal from "./createSetModal/createSetModal";

function DashboardModal({
    collectionSet,
    userId,
}: {
    collectionSet: Flashcard_set_with_count[];
    userId: string;
}) {
    const { isCreateCollectionModalOn, hideCreateCollectionModal } =
        useCreateCollectionModal();

    const { isCreateSetModalOn, hideCreateSetModal } = useCreateSetModal();

    return (
        <>
            <Modal
                modalOn={isCreateCollectionModalOn}
                closeHandler={hideCreateCollectionModal}
                modalTitle="Create Collection"
            >
                <CreateCollectionModal
                    collectionSet={collectionSet}
                    userId={userId}
                />
            </Modal>
            <Modal
                modalOn={isCreateSetModalOn}
                modalTitle="Create new set"
                closeHandler={hideCreateSetModal}
            >
                <CreateSetModal setModal={hideCreateSetModal} />
            </Modal>
        </>
    );
}

export default DashboardModal;
