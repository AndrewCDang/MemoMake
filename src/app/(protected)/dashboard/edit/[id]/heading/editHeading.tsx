"use client";
import { Flashcard_set } from "@/app/_types/types";
import React, { useState } from "react";
import style from "./editHeading.module.scss";
import PublicAccessBtn from "../../(components)/publicAccessBtn";
import { HiCog6Tooth, HiMagnifyingGlass } from "react-icons/hi2";
import Modal from "@/app/_components/modal/modal";
import EditSet from "./editSet/editSet";
import TickValidate from "@/app/_components/tickValidate/tickValidate";

type EditHeadingType = {
    set: Flashcard_set;
};

function EditHeading({ set }: EditHeadingType) {
    const [settingModal, setSettingModal] = useState<boolean>(false);
    return (
        <section>
            <h5>{set.set_name}</h5>
            {set.public_access && (
                <div className={style.publicAccess}>
                    <TickValidate condition={true} />
                    <span>Public Access</span>
                </div>
            )}
            <div className={style.headingContainer}>
                <div>
                    <div className={style.tagsContainer}>
                        {set.set_categories &&
                            set.set_categories.map((item) => {
                                return (
                                    <span
                                        className={style.tags}
                                        key={`${set.id}-tag-${item}`}
                                    >
                                        {item}
                                    </span>
                                );
                            })}
                    </div>
                </div>
                <div className={style.editSettings}>
                    {/* <PublicAccessBtn flashcard_set={set} /> */}
                    <button
                        onClick={() =>
                            setSettingModal((prevState) => !prevState)
                        }
                        className={style.settingsBtn}
                    >
                        <HiCog6Tooth />
                    </button>
                </div>
                <Modal
                    setModal={setSettingModal}
                    modalOn={settingModal}
                    modalTitle="Edit Modal"
                >
                    <EditSet set={set} />
                </Modal>
            </div>
        </section>
    );
}

export default EditHeading;
