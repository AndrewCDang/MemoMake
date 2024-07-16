import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import { Notes } from "../toDoList";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import style from "../pinAndToDo.module.scss";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { HiChevronRight } from "react-icons/hi2";
import { updateUserNoteText } from "../_actions/updateUserNoteText";

const EditPopOver = ({
    id,
    notes,
    setNotes,
    focusedNote,
    setFocusedNote,
    insertNoteHandler,
}: {
    id: string;
    notes: Notes[];
    setNotes: Dispatch<SetStateAction<Notes[]>>;
    focusedNote: string | boolean | null;
    setFocusedNote: Dispatch<SetStateAction<any>>;
    insertNoteHandler: () => void;
}) => {
    const ref = useRef<HTMLInputElement>(null);

    const updateNotes = async () => {
        if (ref.current) {
            const updateNotes = notes.map((item) => {
                if (item.id !== id) return item;
                let updatedNote = item;
                updatedNote.note = ref.current?.value || "";
                return updatedNote;
            });
            setNotes(updateNotes);
            updateUserNoteText({ id, updatedNote: ref.current.value });
            setFocusedNote(null);
        }
    };

    useEffect(() => {
        if (ref.current) {
            ref.current.focus();
        }
    }, [focusedNote]);

    const keyDownHandler = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setFocusedNote(null);
        }
        if (e.key === "Enter") {
            updateNotes();
        }
    };
    useEffect(() => {
        document.addEventListener("keydown", keyDownHandler);
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
        };
    }, [keyDownHandler]);

    return (
        <div className={style.editPopoverWrap}>
            <input
                ref={ref}
                type="text"
                defaultValue={notes.find((item) => item.id === id)?.note || ""}
            ></input>

            <DefaultButton variant="Black" handler={updateNotes}>
                <HiChevronRight />
            </DefaultButton>
        </div>
    );
};

export default EditPopOver;
