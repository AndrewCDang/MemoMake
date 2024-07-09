import React, { RefObject, useEffect, useRef, useState } from "react";
import style from "./tableShadow.module.scss";
import { motion } from "framer-motion";

type TableShadowTypes = {
    targetRef: RefObject<HTMLElement>;
    cardsCount: number;
};

function TableShadow({ targetRef, cardsCount }: TableShadowTypes) {
    const [bottomShadow, setBottomShadow] = useState<Boolean>(true);
    const bottomShadowRef = useRef<boolean>(true);

    const scrollYPosition = () => {
        if (targetRef.current) {
            const target = targetRef.current;
            const containerHeight = target.scrollHeight - target.offsetHeight;
            const scrollValue = target.scrollTop;
            if (scrollValue / containerHeight > 0.8) {
                if (bottomShadowRef.current === true) {
                    setBottomShadow(false);
                    bottomShadowRef.current = false;
                }
            } else if (scrollValue / containerHeight < 0.8) {
                if (bottomShadowRef.current === false) {
                    setBottomShadow(true);
                    bottomShadowRef.current = true;
                }
            }
        }
    };

    useEffect(() => {
        if (targetRef.current) {
            targetRef.current.addEventListener("scroll", scrollYPosition);
            return () => {
                if (targetRef.current) {
                    targetRef.current.removeEventListener(
                        "scroll",
                        scrollYPosition
                    );
                }
            };
        }
    }, [targetRef]);

    return (
        <motion.aside
            style={{
                opacity: bottomShadow && cardsCount > 8 ? 1 : 0,
                transition: "opacity 0.2s ease-in-out",
            }}
            transition={{ duration: 1 }}
            className={style.scrollShadow}
        >
            <span></span>
        </motion.aside>
    );
}

export default TableShadow;
