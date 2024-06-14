"use client";

import { Session } from "next-auth";
import Modal from "../modal/modal";
import ReviseCollectionModalContent from "./reviseCollectionModalContent";
import { useReviseModal } from "./useReviseModal";
import { useEffect } from "react";

function ReviseCollectionModal({
    session,
    contentType,
}: {
    session: Session;
    contentType: "collection" | "set";
}) {
    const { isReviseModalOn, hideReviseModal } = useReviseModal();

    return (
        <Modal
            modalTitle="Collection Preview"
            modalOn={isReviseModalOn}
            closeHandler={hideReviseModal}
        >
            <ReviseCollectionModalContent
                session={session}
                contentType={contentType}
            />
        </Modal>
    );
}

export default ReviseCollectionModal;
