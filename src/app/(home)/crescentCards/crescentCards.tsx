"use client";
import { colours, coloursType } from "@/app/styles/colours";
import style from "./crescentCards.module.scss";
import { motion, useMotionValue } from "framer-motion";
import { IoFlag } from "react-icons/io5";
import { GiJapan } from "react-icons/gi";
import { MdPinDrop } from "react-icons/md";
import { TbBrowser } from "react-icons/tb";
import { IoCarOutline } from "react-icons/io5";
import { HiOutlineBuildingLibrary } from "react-icons/hi2";
import { IoBookOutline } from "react-icons/io5";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import Link from "next/link";

type CardObjectType = {
    svg: ReactNode;
    colour: coloursType;
    id: string;
    name: string;
};
function CrescentCards() {
    const cards = [
        "white",
        "green",
        "yellow",
        "red",
        "blue",
        "purple",
        "yellow",
    ] as coloursType[];

    const cardsObject: CardObjectType[] = [
        {
            svg: <GiJapan />,
            colour: "white",
            id: "db401774-ae61-401e-bda8-f2cc16a286fd",
            name: "Japanese Basics",
        },
        {
            svg: <IoBookOutline />,
            colour: "green",
            id: "84095ec9-4ebd-43b4-bdb9-8f35c7b5eb2f",
            name: "Atomic Habits",
        },
        {
            svg: <IoFlag />,
            colour: "yellow",
            id: "6d29347a-e2f7-4585-b7a1-af3399bfdc0c",
            name: "Country Flags",
        },
        {
            svg: <MdPinDrop />,
            colour: "red",
            id: "6a61e158-03ff-4d18-9e9a-32a9fdc85899",
            name: "Capital Cities",
        },
        {
            svg: <TbBrowser />,
            colour: "blue",
            id: "5f713524-3658-4d13-91c5-558427893e9a",
            name: "HTTP Codes",
        },
        {
            svg: <HiOutlineBuildingLibrary />,
            colour: "purple",
            id: "32bf8fa1-794e-40ba-b60e-57812a328b68",
            name: "Archi- History",
        },
        {
            svg: <IoCarOutline />,
            colour: "yellow",
            id: "a7c26b11-2258-45ff-99e7-56b292cb2b94",
            name: "DVSLA Safety",
        },
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const [contentWidth, setContentWidth] = useState(0);
    const [contentHeight, setContentHeight] = useState(0);

    useEffect(() => {
        if (containerRef.current) {
            setContentWidth(containerRef.current.clientWidth - 160);
            setContentHeight(containerRef.current.clientHeight);
        }
    }, [containerRef]);

    // Function defines the shape of the curve
    const curveFunction = (t: number, width: number, height: number) => {
        const x = (t / Math.PI) * width - width / 2;
        const y = (Math.sin(t) * height) / 2;
        return { x, y };
    };

    // Function estimates the total length of the curve
    const approximateArcLength = (
        width: number,
        height: number,
        steps = 100
    ) => {
        let length = 0;
        let prevPoint = curveFunction(0, width, height);

        for (let i = 1; i <= steps; i++) {
            const t = (i / steps) * Math.PI;
            const currentPoint = curveFunction(t, width, height);
            const dx = currentPoint.x - prevPoint.x;
            const dy = currentPoint.y - prevPoint.y;
            length += Math.sqrt(dx * dx + dy * dy);
            prevPoint = currentPoint;
        }

        return length;
    };

    // Function finds the t value corresponding to a given distance along the total arc length
    const findTForDistance = (
        distance: number,
        width: number,
        height: number,
        steps = 100
    ) => {
        let accumulatedLength = 0;
        let prevPoint = curveFunction(0, width, height);

        for (let i = 1; i <= steps; i++) {
            const t = (i / steps) * Math.PI;
            const currentPoint = curveFunction(t, width, height);
            const dx = currentPoint.x - prevPoint.x;
            const dy = currentPoint.y - prevPoint.y;
            accumulatedLength += Math.sqrt(dx * dx + dy * dy);

            if (accumulatedLength >= distance) {
                return t;
            }

            prevPoint = currentPoint;
        }

        return Math.PI; // Return maximum t if distance exceeds curve length
    };

    // This function calculates the position of a card along the curve
    const positionAlongCurve = (
        index: number,
        totalCards: number,
        width: number,
        height: number
    ) => {
        const totalLength = approximateArcLength(width, height);
        const targetLength = (index / (totalCards - 1)) * totalLength;
        return findTForDistance(targetLength, width, height);
    };

    // Using t value along the curve, gets x and y coordinates
    const xValue = (
        index: number,
        totalCards: number,
        width: number,
        height: number
    ) => {
        const indexValue =
            index === totalCards - 1
                ? totalCards - 1.5
                : index === 0
                ? 0.5
                : index;

        const t = positionAlongCurve(indexValue, totalCards, width, height);
        return curveFunction(t, width, height).x;
    };

    const yValue = (
        index: number,
        totalCards: number,
        width: number,
        height: number
    ) => {
        const t = positionAlongCurve(index, totalCards, width, height);
        return (
            curveFunction(t, width, height).y -
            (index === 0 || index === totalCards - 1 ? 48 : 0)
        );
    };

    const numToPositive = (num: number) => {
        const returnNum = num < 0 ? num * -1 : num;
        return returnNum;
    };

    const rotate = (x: number, y: number) => {
        const rotateDirection = x < 0 ? 1 : -1;
        const x1 = numToPositive(x);
        const y1 = numToPositive(y);

        const rotation =
            ((Math.atan(x1 / y1) * 180) / Math.PI) * rotateDirection;

        return rotation;
    };

    // const rotate = (index: number) => Math.cos((index / 6) * Math.PI) * 90;

    return (
        <div ref={containerRef} className={style.contentContainer}>
            <div className={style.cardContainer}>
                {cardsObject.map((card, index, array) => {
                    const x = xValue(
                        index,
                        cards.length,
                        contentWidth,
                        contentHeight
                    );
                    const y = yValue(
                        index,
                        cards.length,
                        contentWidth,
                        contentHeight
                    );
                    return (
                        <motion.div key={index} className={style.card}>
                            <motion.div
                                className={style.cardBackground}
                                style={{
                                    x: x,
                                    y: y,
                                    rotate: rotate(x, y),
                                }}
                            >
                                <Link
                                    href={`/study?set=${card.id}`}
                                    className={style.cardWrap}
                                >
                                    <div
                                        className={style.frontFace}
                                        style={{
                                            backgroundColor:
                                                colours[card.colour](),
                                        }}
                                    >
                                        <div
                                            className={style.packLine}
                                            style={{
                                                backgroundColor:
                                                    card.colour === "white"
                                                        ? colours.grey()
                                                        : colours.white(),
                                            }}
                                        ></div>
                                        <div className={style.cardContent}>
                                            <div className={style.svgContainer}>
                                                {card.svg}
                                            </div>
                                        </div>
                                    </div>
                                    <div className={style.backFace}>
                                        <div className={style.cardContent}>
                                            <h5>{card.name}</h5>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default CrescentCards;
