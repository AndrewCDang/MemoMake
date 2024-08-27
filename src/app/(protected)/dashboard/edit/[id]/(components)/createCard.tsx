"use client";
import Button from "@/app/_components/(buttons)/styledButton";
import CreateCardModal from "./createCardModal";
import { useEffect, useState } from "react";

type CreateCardTypes = {
    setId: string;
};

function CreateCard({ setId }: CreateCardTypes) {
    const [modalOn, setModalOn] = useState(false);

    const modalHandler = () => {
        setModalOn(true);
    };

    return (
        <div>
            <Button handler={modalHandler} text="Create new card" />
            {modalOn && <CreateCardModal userId="" setId={setId} />}
        </div>
    );
}

export default CreateCard;
