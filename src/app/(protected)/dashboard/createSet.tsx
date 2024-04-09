"use client";

import React from "react";
import Button from "@/app/_components/(buttons)/styledButton";
import { useState, useEffect } from "react";
import useCreateModal from "@/app/_hooks/useCreateSet";
import Modal from "@/app/_components/modal/modal";
import CreateSetModal from "./createSetModal";

function CreateSet() {
    const [modal, setModal] = useState<boolean>(false);

    return (
        <section>
            <Button
                handler={() =>
                    setModal((prevState) => {
                        return !prevState;
                    })
                }
                text="Create new set"
            />
            {modal && (
                <Modal modalTitle="Create new set" setModal={setModal}>
                    <CreateSetModal setModal={setModal} />
                </Modal>
            )}
        </section>
    );
}

export default CreateSet;
