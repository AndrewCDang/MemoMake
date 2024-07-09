import React, {
    Dispatch,
    MutableRefObject,
    RefObject,
    SetStateAction,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./cardsTable.module.scss";
import { AnimatePresence, Reorder, motion } from "framer-motion";
import { ColumnName, ColsWidthType, Refs } from "./cardTableTypes";
import TableRowFilter from "./tableRowFilter";
import ApppliedFilters from "./apppliedFilters";

type TableHeaderTypes = {
    headingRef: RefObject<HTMLTableSectionElement>;
    columns: ColumnName[];
    setColumns: Dispatch<SetStateAction<ColumnName[]>>;
    colsWidth: ColsWidthType;
    targetSlideHeading: MutableRefObject<ColumnName | null>;
    tagArray: string[];
    filteredTags: string[];
    setFilteredTags: Dispatch<SetStateAction<string[]>>;
    selectableTagsArray: string[] | null;
    setSelectableTagsArray: Dispatch<SetStateAction<string[] | null>>;
    filteredDiff: string[];
    setFilteredDiff: Dispatch<SetStateAction<string[]>>;
    setHiddenColumns: Dispatch<SetStateAction<ColumnName[]>>;
    hiddenColumns: ColumnName[];
};

function TableHeader({
    headingRef,
    columns,
    setColumns,
    colsWidth,
    targetSlideHeading,
    tagArray,
    filteredTags,
    setFilteredTags,
    selectableTagsArray,
    setSelectableTagsArray,
    filteredDiff,
    setFilteredDiff,
    setHiddenColumns,
    hiddenColumns,
}: TableHeaderTypes) {
    // const inputRefs = useRef<Refs<HTMLInputElement>>({});
    const headingRefs = useRef<Refs<HTMLElement>>({});
    const filterContainerRefs = useRef<Refs<HTMLElement>>({});
    const [objPopOver, setObjPopOver] = useState<ColumnName | null>(null);

    const handleXpos = useRef<number | null>(null);
    const targetLabel = useRef<string | null>(null);

    const handleDown = (e: MouseEvent, obj: string) => {
        handleXpos.current = e.clientX;
        targetLabel.current = obj;
    };

    const handleUp = (e: MouseEvent) => {
        setTimeout(() => {
            if (!handleXpos.current) return;
            const diffX = Math.abs(handleXpos.current - e.clientX);
            const clickedLabel = targetLabel.current as ColumnName;
            if (
                filterContainerRefs.current[clickedLabel]?.contains(
                    e.target as HTMLElement
                )
            ) {
                return;
            }
            if (clickedLabel === null) return;
            if (diffX > 10) return;
            setObjPopOver(clickedLabel);
        }, 0);
    };

    const tableRowFilterCheck = (e: MouseEvent) => {
        if (objPopOver) {
            const target = e.target as HTMLElement;
            const object = targetLabel.current;
            if (
                object &&
                filterContainerRefs.current[object] &&
                !filterContainerRefs.current[object].contains(target)
            ) {
                setObjPopOver(null);
                handleXpos.current = null;
                targetLabel.current = null;
            }
        }
    };

    useEffect(() => {
        if (headingRefs.current) {
            Object.keys(headingRefs.current).forEach((obj, index) => {
                if (headingRefs.current[obj]) {
                    headingRefs.current[obj].addEventListener(
                        "mousedown",
                        (e) => handleDown(e, obj)
                    );
                    headingRefs.current[obj].addEventListener(
                        "mouseup",
                        handleUp
                    );

                    document.addEventListener("click", tableRowFilterCheck);

                    return () => {
                        if (headingRefs.current[obj]) {
                            headingRefs.current[obj].removeEventListener(
                                "mousedown",
                                (e) => handleDown(e, obj)
                            );
                            headingRefs.current[obj].removeEventListener(
                                "mouseup",
                                handleUp
                            );
                            document.addEventListener(
                                "click",
                                tableRowFilterCheck
                            );
                        }
                    };
                }
            });
        }
    }, [headingRefs, objPopOver]);

    return (
        <thead className={style.headingContainer} ref={headingRef}>
            <Reorder.Group
                as="tr"
                className={`${style.tableRow} ${style.rowContainer}`}
                axis="x"
                values={columns}
                onReorder={setColumns}
            >
                <td className={`${style.selCol}`}></td>
                {columns.map((item, index) => {
                    return (
                        <td
                            key={item}
                            className={`${style.tableHeadingContainer} ${style.headerRow}`}
                            style={{
                                width: `${colsWidth[item]}px`,
                                position: "relative",
                                zIndex: item === objPopOver ? 1000 : 0,
                            }}
                            ref={(el) => (headingRefs.current[item] = el)}
                        >
                            <Reorder.Item
                                as="div"
                                layout="position"
                                value={item}
                                className={`${style.tableHeading} ${style.tableItem}`}
                                key={item}
                            >
                                <h6>{item}</h6>
                            </Reorder.Item>

                            <span
                                onMouseDown={() =>
                                    (targetSlideHeading.current = item)
                                }
                                className={style.colWidthController}
                            >
                                <span></span>
                            </span>
                            <AnimatePresence mode="wait" initial={false}>
                                {item === objPopOver && (
                                    <motion.section
                                        initial={{
                                            opacity: 0,
                                            y: -40,
                                        }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -40 }}
                                        transition={{
                                            duration: 0.12,
                                            ease: "easeOut",
                                        }}
                                        style={{ position: "absolute" }}
                                        className={style.headerRowPop}
                                    >
                                        <TableRowFilter
                                            filterContainerRefs={
                                                filterContainerRefs
                                            }
                                            object={item}
                                            setObjPopOver={setObjPopOver}
                                            setColumns={setColumns}
                                            columns={columns}
                                            tagArray={tagArray}
                                            filteredTags={filteredTags}
                                            setFilteredTags={setFilteredTags}
                                            selectableTagsArray={
                                                selectableTagsArray
                                            }
                                            setSelectableTagsArray={
                                                setSelectableTagsArray
                                            }
                                            filteredDiff={filteredDiff}
                                            setFilteredDiff={setFilteredDiff}
                                            setHiddenColumns={setHiddenColumns}
                                            hiddenColumns={hiddenColumns}
                                        />
                                    </motion.section>
                                )}
                            </AnimatePresence>
                        </td>
                    );
                })}
            </Reorder.Group>
        </thead>
    );
}

export default TableHeader;
