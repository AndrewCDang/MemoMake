"use client";

import { Session } from "next-auth";
import Modal from "../modal/modal";
import ReviseCollectionModalContent from "./reviseModalContent";
import { useReviseModal } from "./useReviseModal";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";

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
            modalTitle={`${capitaliseFirstChar(contentType)} Preview`}
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
