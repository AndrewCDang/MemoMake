import React from "react";
import style from "./colourThemeBanner.module.scss";
import { coloursType } from "@/app/styles/colours";
import { colours } from "@/app/styles/colours";
import { ThemeColour } from "@/app/_types/types";

function ColourThemeBanner({ col }: { col: coloursType | ThemeColour }) {
    return (
        <div
            style={{
                backgroundColor: !["white", "black", "grey"].includes(
                    col || "white"
                )
                    ? colours[col || "white"]()
                    : colours.lightGrey(),
            }}
            className={style.colourThemeBanner}
        ></div>
    );
}

export default ColourThemeBanner;
