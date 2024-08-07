"use client";

import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import GenericButton from "@/app/_components/(buttons)/genericButtton";
import React, { useState } from "react";
import { HiMiniPlusSmall } from "react-icons/hi2";
import style from "./dashboardBtn.module.scss";
import { IoTriangle } from "react-icons/io5";
import { ImFilter } from "react-icons/im";

function DashboardBtnTemplate({
    btnText,
    btnHandler,
}: {
    btnText: string;
    btnHandler?: () => void;
}) {
    const [viewToggle, setViewToggle] = useState<boolean>(false);

    return (
        <div className={style.sectionBtnGroup}>
            {btnHandler && (
                <DefaultButton variant="Black">
                    <div onClick={btnHandler} className={style.sectionBtn}>
                        <div>{btnText}</div>
                        <HiMiniPlusSmall />
                    </div>
                </DefaultButton>
            )}
        </div>
    );
}

export default DashboardBtnTemplate;
