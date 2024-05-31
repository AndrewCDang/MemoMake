"use client"

import { Session } from "next-auth";
import Modal from "../modal/modal"
import ReviseCollectionModalContent from "./reviseCollectionModalContent"
import { useReviseModal } from "./useReviseModal";
import { useEffect } from "react";


function ReviseCollectionModal({session}:{session:Session}) {
    const {
        isReviseModalOn,
        hideReviseModal,
    } = useReviseModal();

  return (
    <Modal
    modalTitle="Collection Preview"
    modalOn={isReviseModalOn}
    closeHandler={hideReviseModal}
>
    <ReviseCollectionModalContent session={session}/>
</Modal>
  )
}

export default ReviseCollectionModal