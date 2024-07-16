"use client";
import { ReactNode, useRef } from "react";

type DraggableProps = {
    children: ReactNode;
    clickHandler: () => void;
    fit?: "wrap" | "stretch";
};
/*
Allows component to be draggable and preventing click events occuring at the end of the drag
Allows click events before drags take place
*/
const Draggable: React.FC<DraggableProps> = ({
    children,
    clickHandler,
    fit = "wrap",
}) => {
    const draggingRef = useRef<boolean>(false);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        timerRef.current = setTimeout(() => {
            draggingRef.current = true;
        }, 100);
    };

    const end = () => {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        setTimeout(() => {
            draggingRef.current = false;
        });
    };

    const handleMouseDown = () => {
        start();
    };

    const handleMouseUp = () => {
        end();
    };

    const handleClick = () => {
        if (!draggingRef.current) {
            clickHandler();
        }
    };

    return (
        <div
            style={{
                height: fit === "stretch" ? "100%" : "",
                width: fit === "stretch" ? "100%" : "",
            }}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onClick={handleClick}
        >
            <div
                style={{
                    height: fit === "stretch" ? "100%" : "",
                    width: fit === "stretch" ? "100%" : "",
                }}
                className="handle"
            >
                {children}
            </div>
        </div>
    );
};

export default Draggable;
