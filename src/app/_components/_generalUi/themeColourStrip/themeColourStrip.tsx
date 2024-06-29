import React from "react";
import style from "./themeColourStrip.module.scss";
import { colours, coloursType } from "@/app/styles/colours";

type ThemeColourStripType = {
    type?: "thin" | "medium" | "thick" | number;
    colour: coloursType;
    alpha?: number;
    radius?: boolean;
    position?: "top" | "bottom";
};
function ThemeColourStrip({
    type = "thin",
    colour,
    alpha = 1,
    radius = true,
    position = "top",
}: ThemeColourStripType) {
    return (
        <div
            className={style.themeThinBannerStrip}
            style={{
                backgroundColor: colours[colour ? colour : "grey"](alpha),
                borderTopLeftRadius: radius ? "1rem" : "0rem",
                borderTopRightRadius: radius ? "1rem" : "0rem",
                top: position === "top" ? "0" : "unset",
                bottom: position === "bottom" ? "0" : "unset",
                height:
                    type === "thin"
                        ? "0.75rem"
                        : type === "medium"
                        ? "1.5rem"
                        : type === "thick"
                        ? "3rem"
                        : `${type}rem`,
            }}
        ></div>
    );
}

export default ThemeColourStrip;
