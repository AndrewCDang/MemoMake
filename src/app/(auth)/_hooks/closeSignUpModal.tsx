"use client";

import React, { ReactNode } from "react";
import { useSignUpModal } from "@/app/_hooks/useSignUp";

function CloseSignUpModal({ children }: { children: ReactNode }) {
    const { removeSignUpModal } = useSignUpModal();
    return <span onClick={removeSignUpModal}>{children}</span>;
}

export default CloseSignUpModal;
