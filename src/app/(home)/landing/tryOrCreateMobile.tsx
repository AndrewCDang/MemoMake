"use client";
import React from "react";
import FlipBtn from "@/app/_components/(buttons)/flipBtn/flipBtn";
import { useSignUpModal } from "@/app/_hooks/useSignUp";
import { useRouter } from "next/navigation";

function TryOrCreateMobile() {
    const { showSignUpModal } = useSignUpModal();
    const router = useRouter();

    return (
        <>
            <FlipBtn
                baseText="Create"
                baseCol={"yellow"}
                hoverCol={"white"}
                hoverText="Create"
                handler={() => showSignUpModal()}
                variant="large"
            />
            <FlipBtn
                baseText="Discover"
                baseCol={"blue"}
                hoverCol={"yellow"}
                hoverText="Discover"
                handler={() => router.push("/discover?search=set")}
                variant="large"
            />
        </>
    );
}

export default TryOrCreateMobile;
