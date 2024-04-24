"use client";

import { ReactNode } from "react";

function ExpandHeightToggler({
    isOn,
    children,
}: {
    isOn: boolean;
    children: ReactNode;
}) {
    return (
        <section
            style={{
                display: "grid",
                gridTemplateRows: isOn ? "1fr" : "0fr",
                transition: "0.2s ease-in-out",
            }}
        >
            <div style={{ overflow: "hidden" }}>{children}</div>
        </section>
    );
}

export default ExpandHeightToggler;
