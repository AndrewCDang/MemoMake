"use client";
import React from "react";
import style from "./sideBarSection.module.scss";
import { HiHome } from "react-icons/hi2";
import { CollectionIcon, SetIcon } from "@/app/_components/svgs/svgs";

function SideBarSection() {
    const clickScrollHandler = (target: string) => {
        const element = document.getElementById(target);
        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
            });
        }
    };

    return (
        <section className={style.sideBarContainer}>
            <div className={style.mainContent}>
                <button onClick={() => clickScrollHandler("dashboard_home")}>
                    <HiHome />
                    <span>Dashboard</span>
                </button>
                <button onClick={() => clickScrollHandler("dashboard_set")}>
                    <SetIcon />
                    <span>Sets</span>
                </button>
                <button
                    onClick={() => clickScrollHandler("dashboard_collection")}
                >
                    <CollectionIcon />
                    <span>Collections</span>
                </button>
            </div>
        </section>
    );
}

export default SideBarSection;
