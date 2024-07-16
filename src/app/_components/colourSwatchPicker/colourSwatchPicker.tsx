import React from "react";
import style from "./colourSwatchPicker.module.scss";
import { colours, coloursType } from "@/app/styles/colours";

function ColourSwatchPicker({
    id,
    selected,
    handler,
}: {
    id: string;
    selected: coloursType;
    handler: (id: string, colour: coloursType) => void;
}) {
    const colourArray = [
        ...Object.keys(colours).filter(
            (item) => !["black", "grey", "lightGrey", "white"].includes(item)
        ),
        "white",
    ] as coloursType[];

    return (
        <aside className={style.colourPickContainer}>
            {colourArray &&
                colourArray.map((item) => (
                    <button
                        onClick={() => handler(id, item)}
                        style={{
                            backgroundColor: colours[item](),
                            outline:
                                selected === item
                                    ? `1px solid ${colours.black()}`
                                    : "",
                            border:
                                selected === item
                                    ? `1.5px solid ${colours.black()}`
                                    : "",
                            pointerEvents: selected === item ? "none" : "unset",
                        }}
                        className={`${style.colPickBtn} ${
                            selected === item && style.selectShadow
                        } ${item === "white" && style.whiteBtn}`}
                        key={`col-swatch-${item}`}
                    ></button>
                ))}
        </aside>
    );
}

export default ColourSwatchPicker;
