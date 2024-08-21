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
1)click events fires if it is released before 200ms after mousedown 
2)On mousedown, timeout created to set dragging status after 200ms
3) on mouseup, timeout cancelled, and dragging status set to false.
*/
const Draggable: React.FC<DraggableProps> = ({
    children,
    clickHandler,
    fit = "wrap",
}) => {
    const draggingRef = useRef<boolean>(false);
    // timerRef.current: This is a reference to store the ID of the timeout that is returned by setTimeout. This ID is needed to cancel the timeout later.
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const start = () => {
        timerRef.current = setTimeout(() => {
            draggingRef.current = true;
        }, 200);
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
