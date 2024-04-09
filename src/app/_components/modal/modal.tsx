import { Dispatch, ReactNode, SetStateAction, useEffect, useRef } from "react";
import style from "./modal.module.scss";
import CornerClose from "../cornerClose/cornerClose";

type ModalTypes = {
    children: ReactNode;
    setModal: Dispatch<SetStateAction<boolean>>;
    modalTitle: string;
};

function Modal({ children, setModal, modalTitle }: ModalTypes) {
    const containerRef = useRef<HTMLElement>(null);
    const modalRef = useRef<HTMLElement>(null);

    // Handles close modal behaviour
    const containerHandler = (e: MouseEvent) => {
        if (modalRef.current) {
            if (!modalRef.current.contains(e.target as Node)) {
                setModal(false);
            }
        }
    };

    useEffect(() => {
        if (modalRef.current && containerRef.current) {
            containerRef.current.addEventListener("click", containerHandler);
        }
    }, [modalRef, containerRef]);

    return (
        <section ref={containerRef} className={style.cardModalContainer}>
            <section ref={modalRef} className={style.cardModal}>
                <CornerClose handler={() => setModal(false)} />
                <h3>{modalTitle}</h3>
                {children}
            </section>
        </section>
    );
}

export default Modal;
