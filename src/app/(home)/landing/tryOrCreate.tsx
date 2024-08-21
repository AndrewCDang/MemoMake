"use client";
import React from "react";
import FlipBtn from "@/app/_components/(buttons)/flipBtn/flipBtn";
import { useSignUpModal } from "@/app/_hooks/useSignUp";

function TryOrCreate() {
    const { showSignUpModal } = useSignUpModal();

    return (
        <FlipBtn
            baseText="Create Set"
            baseCol={"yellow"}
            hoverCol={"white"}
            hoverText="Create Set"
            handler={() => showSignUpModal}
            variant="large"
        />
    );
}

export default TryOrCreate;
