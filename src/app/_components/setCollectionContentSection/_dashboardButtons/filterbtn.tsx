"use client";
import React from "react";
import DefaultButton from "../../(buttons)/defaultButton";
import { ImFilter } from "react-icons/im";
import style from "./filterBtn.module.scss";

type FilterBtnTypes = {};

function Filterbtn({}: FilterBtnTypes) {
    return (
        <DefaultButton>
            <div onClick={() => null} className={style.viewAllBtn}>
                <span>Filter</span>
                <ImFilter
                    style={
                        {
                            // transform: viewToggle
                            //     ? "rotate(180deg)"
                            //     : "rotate(90deg)",
                            // transition: "transform 0.2s ease-in-out",
                        }
                    }
                />
            </div>
        </DefaultButton>
    );
}

export default Filterbtn;
