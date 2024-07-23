import React from "react";
import style from "./colourThemeBanner.module.scss";
import { coloursType } from "@/app/styles/colours";
import { colours } from "@/app/styles/colours";

function ColourThemeBanner({ col }: { col: coloursType }) {
    return (
        <div
            style={{
                backgroundColor: !["white", "black", "grey"].includes(col)
                    ? colours[col]()
                    : colours.lightGrey(),
            }}
            className={style.colourThemeBanner}
        ></div>
    );
}

export default ColourThemeBanner;
