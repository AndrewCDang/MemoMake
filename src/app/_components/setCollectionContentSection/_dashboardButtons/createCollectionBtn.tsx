"use client";
import { useCreateCollectionModal } from "@/app/(protected)/dashboard/_dashboardModals/createCollectionModal/useCreateCollection";
import DashboardBtnTemplate from "./dashboardBtnTemplate";
import { useReviseModal } from "@/app/_components/reviseCollection/useReviseModal";

function CreateCollectionBtn() {
    const { showCreateCollectionModal } = useCreateCollectionModal();
    const { setInitalSet } = useReviseModal();
    const btnHandler = () => {
        showCreateCollectionModal();
        setInitalSet({ item: [] });
    };
    return (
        <DashboardBtnTemplate
            btnText="Create New Collection"
            btnHandler={btnHandler}
        />
    );
}

export default CreateCollectionBtn;
