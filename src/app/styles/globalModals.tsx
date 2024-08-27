import React from "react";
import PreviewModal from "../_components/previewModal/previewModal";
import ReviseModal from "../_components/reviseCollection/reviseModal";
import { auth } from "@/auth";

async function GlobalModals() {
    const session = (await auth()) || undefined;

    return (
        <>
            <PreviewModal />
            <ReviseModal session={session} contentType={"collection"} />
        </>
    );
}

export default GlobalModals;
