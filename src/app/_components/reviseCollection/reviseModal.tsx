"use client";

import { Session } from "next-auth";
import Modal from "../modal/modal";
import ReviseCollectionModalContent from "./reviseModalContent";
import { useReviseModal } from "./useReviseModal";

function ReviseModal({
    session,
    contentType,
}: {
    session: Session | undefined;
    contentType: "collection" | "set";
}) {
    const {
        isReviseModalOn,
        hideReviseModal,
        resetItems,
        initialCollectionItems,
        initialSetItems,
    } = useReviseModal();
    const modalType =
        initialCollectionItems.length > 0
            ? "Collection"
            : initialSetItems.length > 0
            ? "Set"
            : "";

    const isPlural =
        initialCollectionItems.length > 1 || initialSetItems.length > 1
            ? "s"
            : "";
    return (
        <Modal
            modalTitle={`Study ${modalType}${isPlural}`}
            modalOn={isReviseModalOn}
            closeHandler={() => (hideReviseModal(), resetItems())}
        >
            <ReviseCollectionModalContent
                session={session}
                contentType={contentType}
            />
        </Modal>
    );
}

export default ReviseModal;
