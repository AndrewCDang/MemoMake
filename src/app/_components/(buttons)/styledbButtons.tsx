"use client";
import React from "react";
import style from "./styledButtons.module.scss";
import { RightArrow } from "../svgs";
import Link from "next/link";

export function LinkButton1({ text, link }: { text: string; link: string }) {
    return (
        <Link target="_blank" href={link} className={style.anchor}>
            <button className={style.linkButton1}>
                <h6>{text}</h6>
                <div>
                    <RightArrow />
                </div>
                <span>
                    <div>
                        <h6>{text}</h6>
                        <div>
                            <RightArrow />
                        </div>
                    </div>
                </span>

                <span className={style.span2}>
                    <div></div>
                </span>
            </button>
        </Link>
    );
}

export function LinkButton2({ text, link }: { text: string; link: string }) {
    return (
        <Link target="_blank" href={link} className={style.anchor}>
            <button className={style.linkButton2}>
                <h6>{text}</h6>
                <div>
                    <RightArrow />
                </div>
                <span>
                    <div>
                        <h6>{text}</h6>
                        <div>
                            <RightArrow />
                        </div>
                    </div>
                </span>
            </button>
        </Link>
    );
}

import { LoadingSpin } from "../svgs";

export function Button({
    text,
    handler,
    loading,
}: {
    text: string;
    handler?: () => void;
    loading?: boolean;
}) {
    const loadingSpinAni = (
        <div style={{ stroke: "black", width: "100%" }}>
            <LoadingSpin />
        </div>
    );
    const loadingSpinHover = (
        <div style={{ stroke: "white", width: "100%" }}>
            <LoadingSpin />
        </div>
    );

    return (
        <button onClick={() => handler && handler()} className={style.button1}>
            <div>
                <h6>{text}</h6>
                <div>{loading ? loadingSpinAni : <RightArrow />}</div>
                <span>
                    <div>
                        <h6>{text}</h6>
                        <div>{loading ? loadingSpinHover : <RightArrow />}</div>
                    </div>
                </span>
            </div>
        </button>
    );
}
