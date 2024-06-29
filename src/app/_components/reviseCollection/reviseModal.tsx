"use client";

import { Session } from "next-auth";
import Modal from "../modal/modal";
import ReviseCollectionModalContent from "./reviseModalContent";
import { useReviseModal } from "./useReviseModal";

function ReviseModal({
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

export default ReviseModal;
