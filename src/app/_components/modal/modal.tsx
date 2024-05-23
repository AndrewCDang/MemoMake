import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import style from "./modal.module.scss";
import CornerClose from "../cornerClose/cornerClose";
import { motion, AnimatePresence } from "framer-motion";

type ModalTypes = {
    children: ReactNode;
    modalOn: boolean;
    setModal?: Dispatch<SetStateAction<boolean>>;
    closeHandler?: () => void;
    modalTitle: string;
    footer?: ReactNode;
};

function Modal({
    children,
    modalOn,
    setModal,
    closeHandler,
    modalTitle,
    footer,
}: ModalTypes) {
    const containerRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLElement>(null);

    // Handles close modal behaviour
    const containerHandler = (e: MouseEvent) => {
        if (modalRef.current) {
            if (!modalRef.current.contains(e.target as Node)) {
                closeHandler ? closeHandler() : setModal && setModal(false);
            }
        }
    };

    useEffect(() => {
        if (modalRef.current && containerRef.current) {
            containerRef.current.addEventListener("click", containerHandler);
            return () => {
                if (containerRef.current) {
                    containerRef.current.removeEventListener(
                        "click",
                        containerHandler
                    );
                }
            };
        }
    }, [modalRef, containerRef, modalOn]);

    return (
        <AnimatePresence>
            {modalOn && (
                <motion.section
                    exit={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    initial={{ opacity: 0 }}
                    transition={{ duration: 0.12 }}
                    ref={containerRef}
                    className={style.cardModalContainer}
                >
                    <motion.section
                        exit={{ y: 40 }}
                        initial={{ y: 40 }}
                        animate={{ y: 0 }}
                        transition={{
                            type: "spring",
                            duration: 0.15,
                            stiffness: 200,
                        }}
                        ref={modalRef}
                        className={style.cardModal}
                    >
                        <CornerClose
                            handler={() =>
                                closeHandler
                                    ? closeHandler()
                                    : setModal && setModal(false)
                            }
                        />
                        <h3>{modalTitle}</h3>
                        <section className={style.overflowY}>
                            {children}
                        </section>
                        {footer && (
                            <section className={style.footer}>{footer}</section>
                        )}
                    </motion.section>
                </motion.section>
            )}
        </AnimatePresence>
    );
}

export default Modal;
