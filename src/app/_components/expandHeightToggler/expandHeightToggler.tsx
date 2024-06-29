"use client";

import { ReactNode } from "react";

function ExpandHeightToggler({
    isOn,
    transition = true,
    children,
}: {
    isOn: boolean;
    transition?: boolean;
    children: ReactNode;
}) {
    return (
        <section
            style={{
                display: "grid",
                gridTemplateRows: isOn ? "1fr" : "0fr",
                transition: transition ? "0.2s ease-in-out" : "none",
            }}
        >
            <div style={{ overflow: "hidden" }}>{children}</div>
        </section>
    );
}

export default ExpandHeightToggler;
