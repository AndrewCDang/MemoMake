"use client"
import Modal from "../modal/modal"
import style from "./previewModal.module.scss"
import { usePreviewModal } from "./usePreviewModal"
import { Flashcard_collection_set_joined } from "@/app/_actions/fetchCollectionByIdJoinSet"

const PreviewModal = ({flashCardSets}: {flashCardSets : Flashcard_collection_set_joined[]}) => {
    const {isUsePreviewModalOn} = usePreviewModal()
    



    return(
        <Modal modalOn={isUsePreviewModalOn} modalTitle="Preview">
            {
                flashCardSets.map((item)=>{
                    return(
                        <section>
                            <section>
                                <div className={style.setTitle}>

                            {item.}
                                </div>
                                <div className={style.setItemsContainer}>
                                    {item.}
                                </div>

                            </section>
                        </section>
                    )
                })
            }


        </Modal>
    )
}

export default PreviewModal