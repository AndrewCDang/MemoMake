"use client";
import React, { useEffect } from "react";

function RecentItems({ fetch }: { fetch: any }) {
    useEffect(() => {
        console.log(fetch);
    }, [fetch]);
    return <div>RecentItems</div>;
}

export default RecentItems;
