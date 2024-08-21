"use client";
import React, { useEffect, useRef, useState } from "react";
import style from "./landing.module.scss";
import { motion } from "framer-motion";

function Arrows({ index }: { index: number }) {
    const pathRef = useRef<SVGPathElement>(null);
    const arrowRef = useRef<SVGPathElement>(null);
    const arrowRef2 = useRef<SVGPathElement>(null);

    const [pathLength, setPathLength] = useState<number>(0);
    const [arrowLength, setArrowLength] = useState<number>(0);
    const [arrowLength2, setArrowLength2] = useState<number>(0);
    const [showArrows, setShowArrows] = useState<boolean>(false);
    const [showArrowsHeads, setShowArrowsHeads] = useState<boolean>(false);

    useEffect(() => {
        if (pathRef.current) {
            const length = pathRef.current.getTotalLength();
            setPathLength(length);
        }
        if (arrowRef.current) {
            const length = arrowRef.current.getTotalLength();
            setArrowLength(length);
        }
        if (arrowRef2.current) {
            const length = arrowRef2.current.getTotalLength();
            setArrowLength2(length);
        }
        setTimeout(() => {
            setShowArrows(true); // Trigger animation after lengths are set
        }, 1000);
        setTimeout(() => {
            setShowArrowsHeads(true); // Trigger animation after lengths are set
        }, 1500);
    }, []);

    const transform = (index: number) => {
        switch (index) {
            case 1:
                return { transform: "rotate(-15deg)" };
            case 3:
                return { transform: "rotate(-30deg)" };
            case 5:
                return { transform: "scaleY(-1) rotate(30deg)" };
            default:
                return { transform: "" };
        }
    };
    const transformText = (index: number) => {
        switch (index) {
            case 1:
                return { transform: "rotate(-15deg)" };
            case 5:
                return { transform: "scaleY(-1) rotate(30deg) scaleX(-1)" };
            default:
                return { transform: "" };
        }
    };

    return (
        <motion.div
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            className={style.arrowsContainer}
        >
            <div>
                {index === 1 || index === 5 ? (
                    <motion.div
                        style={{ ...transformText(index) }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: showArrows ? 1 : 0 }}
                        className={`cursive ${style.tryMeText}`}
                    >
                        try me
                    </motion.div>
                ) : null}
                <motion.svg
                    style={transform(index)}
                    width="178"
                    height="70"
                    viewBox="0 0 178 70"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <motion.path
                        d="M175.012 47.0093C145.873 27.2901 70.4767 -2.81102 1.99992 34.5381"
                        stroke="black"
                        strokeWidth="3"
                        fill="none"
                        ref={pathRef}
                        strokeDashoffset={pathLength}
                        strokeDasharray={pathLength}
                        animate={
                            showArrows
                                ? { strokeDashoffset: 0 }
                                : { strokeDashoffset: pathLength }
                        }
                        transition={{
                            strokeDashoffset: 1,
                            duration: 1,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.path
                        d="M2 35.5L6 22"
                        ref={arrowRef}
                        stroke="black"
                        strokeWidth="3"
                        fill="none"
                        strokeDashoffset={arrowLength}
                        strokeDasharray={arrowLength}
                        animate={
                            showArrowsHeads
                                ? { strokeDashoffset: 0 }
                                : { strokeDashoffset: arrowLength }
                        }
                        transition={{
                            strokeDashoffset: 1,
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                    />
                    <motion.path
                        d="M1 34.5L14 38.5"
                        ref={arrowRef2}
                        stroke="black"
                        strokeWidth="3"
                        fill="none"
                        strokeDashoffset={arrowLength2}
                        strokeDasharray={arrowLength2}
                        animate={
                            showArrowsHeads
                                ? { strokeDashoffset: 0 }
                                : { strokeDashoffset: arrowLength2 }
                        }
                        transition={{
                            strokeDashoffset: 1,
                            duration: 0.2,
                            ease: "easeInOut",
                        }}
                    />
                </motion.svg>
            </div>
        </motion.div>
    );
}

export default Arrows;
