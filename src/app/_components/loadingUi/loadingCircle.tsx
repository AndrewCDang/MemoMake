"use client";
import React from "react";
import style from "./loadingCircle.module.scss";
import { SquareLoader } from "react-spinners";
import { colours } from "@/app/styles/colours";
import LoadingSpin from "../svgs/svgs";

function LoadingCircle({
    variant = "contain",
}: {
    variant?: "cover" | "contain";
}) {
    return (
        <div
            className={`${style.loaderContainer} ${
                variant === "contain"
                    ? style.loadingContain
                    : variant === "cover"
                    ? style.loadingCover
                    : ""
            }`}
        >
            {/* <SquareLoader className={style.loading} color={colours.yellow()} /> */}
            <LoadingSpin />
        </div>
    );
}

export default LoadingCircle;
