import React from "react";

export function clipPath({ scale = 0.5 }: { scale?: number }) {
    const pathGap = 40;
    const pathGapBtm = pathGap + 20;
    const pathGapEnd = pathGap + 40;

    const newPathD = `path("M0 ${64 * scale} Q0 ${40 * scale} ${16 * scale} ${
        40 * scale
    } L${pathGap * scale} ${40 * scale}  Q${pathGapBtm * scale} ${40 * scale} ${
        pathGapBtm * scale
    } ${16 * scale} Q${pathGapBtm * scale} 0 ${
        pathGapEnd * scale
    } 0 H10000 V10000 H0 Z")`;
    return newPathD;
}
