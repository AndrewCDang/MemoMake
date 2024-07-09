"use client";
import React, {
    Dispatch,
    ReactNode,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
} from "react";

type ModalAbsoluteType = {
    setModalState: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
};
function ModalAbsolute({ setModalState, children }: ModalAbsoluteType) {
    const modalRef = useRef<HTMLDivElement>(null);

    const clickHandler = (e: MouseEvent | TouchEvent) => {
        if (modalRef.current) {
            if (!modalRef.current.contains(e.target as Node)) {
                setModalState(false);
            }
        }
    };

    useEffect(() => {
        if (modalRef.current) {
            window.addEventListener("mouseup", clickHandler);
            window.addEventListener("touchend", clickHandler);

            return () => {
                if (modalRef.current) {
                    window.removeEventListener("mouseup", clickHandler);
                    window.removeEventListener("touchend", clickHandler);
                }
            };
        }
    }, [modalRef]);

    return <div ref={modalRef}>{children}</div>;
}

export default ModalAbsolute;
