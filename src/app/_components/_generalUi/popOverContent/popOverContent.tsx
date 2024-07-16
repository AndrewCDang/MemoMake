"use client";
import {
    Dispatch,
    MutableRefObject,
    ReactNode,
    SetStateAction,
    useEffect,
    useRef,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import style from "./popOverContent.module.scss";

type PopOverContentType = {
    children: ReactNode;
    isOn: boolean;
    setIsOn: Dispatch<SetStateAction<any>>;
    animation?: "simple" | "stylised";
};

function PopOverContent({
    children,
    isOn,
    animation = "simple",
    setIsOn,
}: PopOverContentType) {
    const ref = useRef<HTMLDivElement>(null);
    const simpleAnimation = {
        exit: { opacity: 0 },
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: 0 },
        transition: { duration: 0.12 },
    };

    const stylisedAnimation = {
        exit: { opacity: 0, y: -8 },
        animate: { opacity: 1, y: 0 },
        initial: { opacity: 0, y: -8 },
        transition: { stiffness: 800, damping: 10, mass: 0.5 },
    };

    const animationType =
        animation === "simple" ? simpleAnimation : stylisedAnimation;

    const mountRef = useRef(false);

    const clickHandler = (e: MouseEvent | TouchEvent) => {
        if (mountRef.current === true) {
            if (
                ref.current &&
                !ref.current.contains(e.target as Node) &&
                setIsOn
            ) {
                setIsOn(false);
            }
        } else {
            mountRef.current = true;
        }
    };

    useEffect(() => {
        if (ref.current && isOn) {
            window.addEventListener("click", clickHandler);
            return () => {
                if (ref.current) {
                    window.removeEventListener("click", clickHandler);
                    mountRef.current = false;
                }
            };
        }
    }, [ref, isOn]);

    return (
        <AnimatePresence mode="wait" initial={false}>
            {isOn && (
                <motion.div ref={ref} {...animationType}>
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PopOverContent;
