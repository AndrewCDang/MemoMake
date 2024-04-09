"use client";

import { ReactNode } from "react";
import { useForgotModal } from "../_hooks/useForgot";

function CloseForgotPassword({ children }: { children: ReactNode }) {
    const { closeForgotModal } = useForgotModal();

    const closeForgotHandler = () => {
        closeForgotModal();
    };

    return (
        <button
            onClick={() => {
                closeForgotHandler();
            }}
        >
            {children}
        </button>
    );
}

export default CloseForgotPassword;
