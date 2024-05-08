"use client";

import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import GenericButton from "@/app/_components/(buttons)/genericButtton";
import React from "react";
import { HiMiniPlusSmall } from "react-icons/hi2";
import style from "./dashboardBtn.module.scss";

function DashboardBtnTemplate({
    btnText,
    btnHandler,
    viewAllHandler,
}: {
    btnText: string;
    btnHandler: () => void;
    viewAllHandler: () => void;
}) {
    return (
        <div className={style.sectionBtnGroup}>
            <DefaultButton>
                <div onClick={btnHandler} className={style.sectionBtn}>
                    <div>{btnText}</div>
                    <HiMiniPlusSmall />
                </div>
            </DefaultButton>
            <GenericButton handler={viewAllHandler} type="hyperlink">
                View All
            </GenericButton>
        </div>
    );
}

export default DashboardBtnTemplate;
