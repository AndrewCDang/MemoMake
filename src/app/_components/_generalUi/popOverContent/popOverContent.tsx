"use client";
import { Dispatch, ReactNode, SetStateAction } from "react";
import { AnimatePresence, motion } from "framer-motion";
import style from "./popOverContent.module.scss";

type PopOverContentType = {
    isOn: boolean;
    setIsOn: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
};

function PopOverContent({ isOn, children }: PopOverContentType) {
    return (
        <AnimatePresence mode="wait" initial={false}>
            {isOn && (
                <motion.div
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1, y: 0 }}
                    initial={{ opacity: 0, y: 24 }}
                    className={style.popOverContainer}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default PopOverContent;
