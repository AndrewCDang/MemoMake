"use client";
import style from "./contentCarousel.module.scss";
import React, {
    ReactNode,
    ReactElement,
    isValidElement,
    useRef,
    useEffect,
    useState,
    useLayoutEffect,
} from "react";
import { motion } from "framer-motion";
import DefaultButton from "../(buttons)/defaultButton";
import { HiChevronRight } from "react-icons/hi2";
import { HiChevronLeft } from "react-icons/hi2";

/**
 * A component that acts as a parent for a content carousel.
 * Parent Component for <ContentCarouselChild/>
 *
 * @param {Object} props - The properties object.
 * @param {ReactNode} props.children - The child elements to be rendered inside the carousel.
 * @param {any[]} [props.updateValues=[]] - An optional array of values that trigger updates in the carousel.
 * @returns {JSX.Element} The rendered content carousel parent component.
 */

export function ContentCarouselParent({
    children,
    updateValues = [],
    btnType = "sideToSideBtm",
    refreshOnLoad = true,
}: {
    children: ReactNode;
    updateValues?: any[];
    btnType?: "allInLine" | "sideToSideBtm";
    refreshOnLoad?: boolean;
}) {
    // Converting children to an array
    const childrenArray = React.Children.toArray(children);

    // Filter to get only ContentCarouselChild components
    const filteredChildren = childrenArray.filter(
        (child): child is ReactElement => {
            if (isValidElement(child)) {
                if (
                    (child.type as any).displayName === "ContentCarouselChild"
                ) {
                    return true;
                }
            }
            return false;
        }
    );

    const filteredPageNames = filteredChildren.map((child) => {
        return child.props.pageName;
    });

    const refs = useRef<(HTMLDivElement | null)[]>([]);
    const setRef = (index: number) => (element: HTMLDivElement | null) => {
        refs.current[index] = element;
    };

    const [selectedCarouselIndex, setSelectedCarouselIndex] =
        useState<number>(0);

    const [parentHeight, setParentHeight] = useState<number>(0);

    useEffect(() => {
        if (refs.current) {
            setParentHeight(
                refs.current[selectedCarouselIndex]?.offsetHeight || 0
            );
        }
    }, [refs.current, updateValues]);

    const pageBtnHandler = (num: number) => {
        if (num === -1) {
            setSelectedCarouselIndex((prev) => {
                setParentHeight((prevState) => {
                    if (refs.current[prev - 1]?.offsetHeight) {
                        return refs.current[prev - 1]?.offsetHeight || prev;
                    }
                    return prevState;
                });
                return prev - 1;
            });
        }
        if (num === 1) {
            setSelectedCarouselIndex((prev) => {
                setParentHeight((prevState) => {
                    if (refs.current[prev + 1]?.offsetHeight) {
                        return refs.current[prev + 1]?.offsetHeight || prev;
                    }
                    return prevState;
                });
                return prev + 1;
            });
        }
    };

    return (
        <section className={style.carouselWrapOverflowOffset}>
            {/* Page Btns - Display all in line */}
            {btnType === "allInLine" && (
                <div className={style.btnContainer}>
                    {filteredPageNames.map((item, index) => {
                        return (
                            <DefaultButton
                                key={item}
                                handler={() => setSelectedCarouselIndex(index)}
                                variant={
                                    filteredPageNames[selectedCarouselIndex] ===
                                    item
                                        ? "Black"
                                        : "White"
                                }
                            >
                                {item}
                            </DefaultButton>
                        );
                    })}
                </div>
            )}
            {/* Page Contents */}
            <motion.div
                animate={{ height: `${parentHeight}px` }}
                initial={{ height: `${parentHeight}px` }}
                className={style.carouselParent}
            >
                {filteredChildren.map((item, index) => (
                    <motion.article
                        ref={setRef(index)}
                        className={style.carouselChild}
                        animate={{
                            left: `${
                                index * 100 - selectedCarouselIndex * 100
                            }%`,
                        }}
                        initial={{ left: `${index * 100}%` }}
                        style={{ top: 0 }}
                        key={index}
                    >
                        {item}
                    </motion.article>
                ))}
            </motion.div>
            {/* Page Buttons - Selecting Page content */}
            {btnType === "sideToSideBtm" && (
                <div className={style.pageBtnsContainer}>
                    {selectedCarouselIndex > 0 && (
                        <DefaultButton handler={() => pageBtnHandler(-1)}>
                            <HiChevronLeft />
                            {filteredPageNames[selectedCarouselIndex - 1]}
                        </DefaultButton>
                    )}
                    {selectedCarouselIndex < filteredPageNames.length - 1 && (
                        <DefaultButton handler={() => pageBtnHandler(1)}>
                            {filteredPageNames[selectedCarouselIndex + 1]}
                            <HiChevronRight />
                        </DefaultButton>
                    )}
                </div>
            )}
        </section>
    );
}

/**
 * A component that acts as a child inside the parent content carousel.
 *
 * @param {ReactNode} props.children - The child elements to be rendered inside the carousel.
 * @param {string} props.pageName - Label of carousel page, indicated on left/right buttons
 * @returns {JSX.Element} The rendered content is used and rendered within the parent component
 */

export function ContentCarouselChild({
    children,
}: {
    children: ReactNode;
    pageName: string;
}) {
    return <>{children}</>;
}
ContentCarouselChild.displayName = "ContentCarouselChild";
