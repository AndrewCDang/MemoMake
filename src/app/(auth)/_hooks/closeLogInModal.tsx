"use client";

import React, { ReactNode } from "react";
import { useLogInModal } from "@/app/_hooks/useLogIn";

function CloseLogInModal({ children }: { children: ReactNode }) {
    const { removeLogInModal } = useLogInModal();
    return <span onClick={removeLogInModal}>{children}</span>;
}

export default CloseLogInModal;
