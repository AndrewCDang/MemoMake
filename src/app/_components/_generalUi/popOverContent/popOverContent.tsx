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
};

function PopOverContent({ children, isOn }: PopOverContentType) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            {isOn && (
                <motion.div
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 0 }}
                    transition={{ duration: 0.12 }}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PopOverContent;
