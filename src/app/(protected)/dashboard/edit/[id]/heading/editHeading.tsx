"use client";
import { Flashcard_set } from "@/app/_types/types";
import React, { useState } from "react";
import style from "./editHeading.module.scss";
import PublicAccessBtn from "../../(components)/publicAccessBtn";
import { HiCog6Tooth, HiMagnifyingGlass } from "react-icons/hi2";
import Modal from "@/app/_components/modal/modal";
import EditSet from "./editSet/editSet";
import TickValidate from "@/app/_components/tickValidate/tickValidate";
import { capitaliseFirstChar } from "@/app/_functions/capitaliseFirstChar";
import { BannerIcon } from "@/app/_components/setAndCollectionCard/generalComponents/bannerBtns/bannerBtns";

type EditHeadingType = {
    set: Flashcard_set;
};

function EditHeading({ set }: EditHeadingType) {
    const [settingModal, setSettingModal] = useState<boolean>(false);

    return (
        <section className={style.setTitleBannerContainer}>
            <div className={style.titleAndImageContainer}>
                <img className={style.setImage} src={set.image}></img>
                <h5>{capitaliseFirstChar(set.set_name)}</h5>
            </div>
            {set.public_access && (
                <div className={style.publicAccess}>
                    <TickValidate condition={true} />
                    <span>Public Access</span>
                </div>
            )}
            <div className={style.headingContainer}>
                <div className={style.tagsContainerWrap}>
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
                    <BannerIcon
                        hoverText="Public Access | Settings"
                        handler={() =>
                            setSettingModal((prevState) => !prevState)
                        }
                        hoverPos="left"
                    >
                        <div className={style.settingsBtn}>
                            <HiCog6Tooth />
                        </div>
                    </BannerIcon>
                </div>
                <Modal
                    setModal={setSettingModal}
                    modalOn={settingModal}
                    modalTitle="Edit Set"
                >
                    <EditSet set={set} />
                </Modal>
            </div>
        </section>
    );
}

export default EditHeading;
