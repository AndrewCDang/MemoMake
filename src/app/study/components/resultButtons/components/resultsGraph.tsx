import React, { useEffect, useState } from "react";
import style from "./resultsGraph.module.scss";
import { colours } from "@/app/styles/colours";

function ResultsGraph({
    progress,
    showScore = true,
    customWidth = null,
}: {
    progress: number;
    showScore?: boolean;
    customWidth?: number | null;
}) {
    // Base values
    const strokeWidth = 10; // Stroke width
    const minGraph = 40;
    const maxGraph = 132;

    function getGraphSize() {
        const viewportWidth = window.innerWidth;
        const computedSize = minGraph / 2 + 0.1 * viewportWidth;
        return Math.max(minGraph, Math.min(computedSize, maxGraph));
    }

    const [graphSize, setGraphSize] = useState(getGraphSize());
    const [percent, setPercent] = useState(0);
    const [percentText, setPercentText] = useState(0);

    useEffect(() => {
        // Function to handle the updating process
        const percentTextHandler = () => {
            if (percentText < percent) {
                setPercentText((prevState) => prevState + 1);
            }
        };

        if (percentText < percent) {
            const timer = setTimeout(percentTextHandler, 1000 / percent);
            return () => clearTimeout(timer);
        }
    }, [percentText, percent]);

    // Update graphSize when the window resizes
    useEffect(() => {
        setPercent(progress);
        function handleResize() {
            setGraphSize(getGraphSize());
        }
        if (customWidth) {
            setGraphSize(customWidth);
        } else {
            window.addEventListener("resize", handleResize);
            return () => {
                window.removeEventListener("resize", handleResize);
            };
        }
    }, []);

    // Adjust the radius to be within the SVG viewbox
    const radius = (graphSize - strokeWidth) / 2; // Adjust radius to fit within the SVG dimensions

    // Calculate the circumference based on the dynamic radius
    const circumference = 2 * Math.PI * radius;

    // Calculate strokeDasharray and strokeDashoffset based on progress
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference * ((100 - percent) / 100);

    return (
        <section className={style.graphContainer}>
            <svg
                className={style.svgContainer}
                width={`${graphSize}px`}
                height={`${graphSize}px`}
                style={{ overflow: "visible" }}
            >
                <circle
                    className={style.svgTrack}
                    cx={`${graphSize / 2}px`}
                    cy={`${graphSize / 2}px`}
                    r={`${radius}px`}
                    fill="transparent"
                    strokeWidth={`${strokeWidth}px`}
                    strokeLinecap="round"
                />
                <circle
                    cx={`${graphSize / 2}px`}
                    cy={`${graphSize / 2}px`}
                    r={`${radius}px`}
                    fill="transparent"
                    stroke={colours.green()}
                    strokeWidth={`${strokeWidth + 0.5}px`}
                    strokeDasharray={`${strokeDasharray}px`}
                    strokeDashoffset={`${strokeDashoffset}px`}
                    strokeLinecap="round"
                    className={style.svgProgress}
                    style={{
                        strokeDashoffset: `${strokeDashoffset}px`,
                        strokeDasharray: `${strokeDasharray}px`,
                        transition: "stroke-dashoffset 1s ease-in-out",
                    }}
                />
            </svg>
            {showScore && (
                <p className={style.percentText}>
                    {percent && Math.floor(percentText) + "%"}
                </p>
            )}
        </section>
    );
}

export default ResultsGraph;
