"use client";
import React, {
    ChangeEvent,
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";
import style from "./pinAndToDo.module.scss";
import TextInput from "@/app/_components/textInput/inputField";
import { HiChevronRight } from "react-icons/hi2";
import { colours, coloursType } from "@/app/styles/colours";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";
import { Reorder } from "framer-motion";
import { debounce } from "@/app/_functions/debounce";
import Draggable from "@/app/_components/draggable/draggable";
import EditPopOver from "./toDoComponents/editPopOver";
import PopItemWrap from "./toDoComponents/popItemWrap";
import ColourSwatchPicker from "@/app/_components/colourSwatchPicker/colourSwatchPicker";
import PopOverMenu from "./toDoComponents/popOverMenu";
import { v4 as uuidV4 } from "uuid";
import { Session } from "next-auth";
import { insertNewUserNote } from "./_actions/insertNewNote";
import { deleteUserNote } from "./_actions/deleteUserNote";
import { updateUserNoteColour } from "./_actions/updateUserNoteColour";
import { array } from "zod";
import { updateUserNoteSequence } from "./_actions/updateUserNoteSequence";

export type Notes = {
    id: string;
    user_id: string;
    note: string;
    sequence: number;
    colour: coloursType;
};

function ToDoList({
    session,
    userNotes,
}: {
    session: Session;
    userNotes: Notes[];
}) {
    const [notes, setNotes] = useState<Notes[]>(userNotes);

    // NotesContainerRef
    const notesContainerRef = useRef<HTMLDivElement>(null);

    // State which focuses on one of the popover menus
    const [focusedNoteMenu, setFocusedNoteMenu] = useState<
        string | null | false
    >(null);

    // Creating New Note
    const [inputValue, setInputValue] = useState<string>("");
    const changeHandler = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        setInputValue(e.target.value);
    };

    const getNextSequence = () => {
        const sequenceList =
            Math.max(...notes.flatMap((item) => item.sequence), 0) + 10;
        return sequenceList;
    };

    // Inserting new note
    const insertNoteHandler = async () => {
        const newNote: Notes = {
            id: uuidV4(),
            user_id: session.user.id,
            note: inputValue,
            sequence: getNextSequence(),
            colour: "white",
        };
        setNotes((prevState) => [...prevState, newNote]);
        insertNewUserNote(newNote);
        setTimeout(() => {
            if (notesContainerRef.current) {
                notesContainerRef.current.scrollTo({
                    top: notesContainerRef.current.scrollHeight,
                    behavior: "smooth",
                });
            }
        }, 0);
        setInputValue("");
    };

    // Updating order after drag

    const updateOrderHandler = useCallback(async (reorderedNotes: Notes[]) => {
        const reorderedItem = reorderedNotes.filter((item, index, array) => {
            const sequenceBefore = Number(array[index - 1]?.sequence) || 0;
            const sequenceAfter =
                Number(array[index + 1]?.sequence) ||
                Number(array[array.length - 2].sequence) + 10;

            const isBiggerThanPrevItem = item.sequence > sequenceBefore;
            const isSmallerThanNextItem = item.sequence < sequenceAfter;
            // Item at start of list
            if (index === 0 && !isSmallerThanNextItem) {
                let updatedItem = item;
                updatedItem.sequence = (sequenceAfter + sequenceBefore) / 2;
                return item;
            }
            // Item at end of list
            if (index === array.length - 1 && !isBiggerThanPrevItem) {
                let updatedItem = item;
                updatedItem.sequence = sequenceAfter;
                return item;
            }

            // Item in middle of list (item moved up list)
            if (
                isBiggerThanPrevItem &&
                !isSmallerThanNextItem &&
                sequenceAfter > sequenceBefore
            ) {
                let updatedItem = item;
                updatedItem.sequence = (sequenceAfter + sequenceBefore) / 2;
                return updatedItem;
            }

            // Item in middle of list (item moved down list)
            if (
                !isBiggerThanPrevItem &&
                isSmallerThanNextItem &&
                sequenceAfter > sequenceBefore
            ) {
                let updatedItem = item;
                updatedItem.sequence = (sequenceAfter + sequenceBefore) / 2;
                return updatedItem;
            }
        });
        const updatedItem = reorderedItem[0];
        updateUserNoteSequence(updatedItem);
    }, []);

    // Create the debounced function
    const debouncedUpdateOrderHandler = useCallback(
        debounce((notes: Notes[]) => updateOrderHandler(notes), 1000),
        [updateOrderHandler]
    );

    // Edit Note
    const [focusedNote, setFocusedNote] = useState<string | boolean | null>(
        null
    );

    // Edit Colour
    const [focusedColour, setFocusedColour] = useState<string | boolean | null>(
        null
    );
    const noteColourHandler = async (id: string, colour: coloursType) => {
        setNotes((prevState) => {
            const updatedNotes = notes.map((item) => {
                if (item.id !== id) return item;

                let updatedNote = item;
                updatedNote.colour = colour;

                return updatedNote;
            });
            return updatedNotes;
        });
        updateUserNoteColour({ id: id, colour: colour });
        setFocusedColour(null);
    };

    // Delete Handler
    const deleteNoteHandler = async (id: string) => {
        setNotes((prevState) => {
            const remainingNotes = prevState.filter((item) => item.id !== id);
            return remainingNotes;
        });
        deleteUserNote(id);
    };

    // UseEffect turns off popover when any secondary popover items are selected
    useEffect(() => {
        if (focusedNote || focusedColour) {
            if (focusedNoteMenu) {
                setFocusedNoteMenu(null);
            }
        }
    }, [focusedNote, focusedColour]);

    const isFocused = focusedNote || focusedColour;

    return (
        <section className={style.asideContainer}>
            <div className={style.asideAbsolute}>
                <h6>To-do / Notes</h6>
                <div className={style.notesContainerWrap}>
                    <div
                        ref={notesContainerRef}
                        className={style.notesContainer}
                    >
                        <Reorder.Group
                            as="div"
                            axis="y"
                            onReorder={(notes) => {
                                setNotes(notes);
                                debouncedUpdateOrderHandler(notes);
                            }}
                            values={notes}
                            className={style.noteItemsContainer}
                        >
                            {notes &&
                                notes.map((item) => {
                                    return (
                                        <Reorder.Item
                                            as="div"
                                            layout="position"
                                            value={item}
                                            className={style.noteItem}
                                            style={{
                                                backgroundColor:
                                                    item.colour &&
                                                    ![
                                                        "white",
                                                        "lightGrey",
                                                        "grey",
                                                    ].includes(item.colour)
                                                        ? colours[item.colour]()
                                                        : colours.lightGrey(
                                                              0.3
                                                          ),
                                            }}
                                            key={`${item.note}`}
                                        >
                                            <Draggable
                                                fit="stretch"
                                                clickHandler={() =>
                                                    isFocused
                                                        ? null
                                                        : setFocusedNoteMenu(
                                                              item.id
                                                          )
                                                } //When popover is toggled on, clicking on popover won't fire this callback function
                                            >
                                                <div
                                                    className={
                                                        style.menuContainerWrap
                                                    }
                                                >
                                                    {/* PopOverMenu */}
                                                    <PopOverMenu
                                                        item={item}
                                                        focusedColour={
                                                            focusedColour
                                                        }
                                                        focusedNote={
                                                            focusedNote
                                                        }
                                                        focusedNoteMenu={
                                                            focusedNoteMenu
                                                        }
                                                        setFocusedNoteMenu={
                                                            setFocusedNoteMenu
                                                        }
                                                        deleteNoteHandler={
                                                            deleteNoteHandler
                                                        }
                                                        setFocusedColour={
                                                            setFocusedColour
                                                        }
                                                        setFocusedNote={
                                                            setFocusedNote
                                                        }
                                                    />
                                                    {/* Edit Text Popover */}
                                                    <PopItemWrap
                                                        focused={
                                                            focusedNote ===
                                                            item.id
                                                        }
                                                        setFocus={
                                                            setFocusedNote
                                                        }
                                                    >
                                                        <EditPopOver
                                                            id={item.id}
                                                            notes={notes}
                                                            setNotes={setNotes}
                                                            focusedNote={
                                                                focusedNote
                                                            }
                                                            setFocusedNote={
                                                                setFocusedNote
                                                            }
                                                            insertNoteHandler={
                                                                insertNoteHandler
                                                            }
                                                        />
                                                    </PopItemWrap>
                                                    {/* Colour Picker Popover */}
                                                    <PopItemWrap
                                                        focused={
                                                            focusedColour ===
                                                            item.id
                                                        }
                                                        setFocus={
                                                            setFocusedColour
                                                        }
                                                    >
                                                        <div
                                                            className={
                                                                style.colourSwatchPickerWrap
                                                            }
                                                        >
                                                            <ColourSwatchPicker
                                                                id={item.id}
                                                                selected={
                                                                    item.colour
                                                                }
                                                                handler={(
                                                                    id: string,
                                                                    colour: coloursType
                                                                ) =>
                                                                    noteColourHandler(
                                                                        id,
                                                                        colour
                                                                    )
                                                                }
                                                            />
                                                        </div>
                                                    </PopItemWrap>
                                                    <span>{item.note}</span>
                                                </div>
                                            </Draggable>
                                        </Reorder.Item>
                                    );
                                })}
                        </Reorder.Group>
                    </div>
                    <div className={style.newNoteItem}>
                        <TextInput
                            height="short"
                            id="to-do-input"
                            placeholder="Type in new to-do / note"
                            type="text"
                            handler={changeHandler}
                            inputValue={inputValue}
                            enterHandler={insertNoteHandler}
                        />
                        <DefaultButton
                            variant="Black"
                            handler={insertNoteHandler}
                        >
                            <HiChevronRight />
                        </DefaultButton>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default ToDoList;
