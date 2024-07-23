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
                    <div
                        className={`${style.colPickBtn} ${style.radioContainer}`}
                        key={`col-swatch-${item}`}
                    >
                        <input
                            type="radio"
                            id={`${id}-colour-${item}`}
                            name={`${id}-colourSwatch`}
                            onChange={() => handler(id, item)}
                        ></input>
                        <label
                            htmlFor={`${id}-colour-${item}`}
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
                                pointerEvents:
                                    selected === item ? "none" : "unset",
                            }}
                            className={`${
                                selected === item && style.selectShadow
                            } ${item === "white" && style.whiteBtn}`}
                        ></label>
                    </div>
                ))}
        </aside>
    );
}

export default ColourSwatchPicker;
