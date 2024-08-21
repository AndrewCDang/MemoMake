import React, { Dispatch, SetStateAction } from "react";
import style from "../pinAndToDo.module.scss";
import { BannerIcon } from "@/app/_components/setAndCollectionCard/generalComponents/bannerBtns/bannerBtns";
import {
    HiMiniPencilSquare,
    HiMiniSquares2X2,
    HiMiniTrash,
} from "react-icons/hi2";
import { ChangeColourIcons } from "@/app/_components/svgs/svgs";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import { Notes } from "../toDoList";

const NoteIconComponent = () => {
    return (
        <BannerIcon
            hoverText={"Click for menu \n Drag to reorder"}
            handler={() => null}
            hoverPos="right"
        >
            <HiMiniSquares2X2 />
        </BannerIcon>
    );
};

function PopOverMenu({
    item,
    focusedNoteMenu,
    focusedNote,
    focusedColour,
    setFocusedNoteMenu,
    deleteNoteHandler,
    setFocusedNote,
    setFocusedColour,
}: {
    item: Notes;
    focusedNoteMenu: string | null | boolean;
    focusedNote: string | null | boolean;
    focusedColour: string | null | boolean;
    setFocusedNoteMenu: Dispatch<SetStateAction<any>>;
    deleteNoteHandler: (id: string) => void;
    setFocusedNote: Dispatch<SetStateAction<any>>;
    setFocusedColour: Dispatch<SetStateAction<any>>;
}) {
    return (
        <div className={style.menuContainer}>
            <NoteIconComponent />
            <div className={style.menuWrap}>
                <PopOverContent
                    isOn={
                        item.id === focusedNoteMenu &&
                        ![focusedNote, focusedColour].includes(item.id)
                    }
                    setIsOn={setFocusedNoteMenu}
                >
                    <div className={style.menuOptions}>
                        {/* Edit */}
                        <BannerIcon
                            hoverText={"Edit Note"}
                            handler={() => setFocusedNote(item.id)}
                        >
                            <HiMiniPencilSquare />
                        </BannerIcon>
                        {/* Delete */}
                        <BannerIcon
                            hoverText={"Delete Note"}
                            handler={() => deleteNoteHandler(item.id)}
                        >
                            <HiMiniTrash />
                        </BannerIcon>
                        {/* Change Colour */}
                        <BannerIcon
                            hoverText={"Change Colour"}
                            handler={() => setFocusedColour(item.id)}
                        >
                            <ChangeColourIcons />
                        </BannerIcon>
                    </div>
                </PopOverContent>
            </div>
        </div>
    );
}

export default PopOverMenu;
