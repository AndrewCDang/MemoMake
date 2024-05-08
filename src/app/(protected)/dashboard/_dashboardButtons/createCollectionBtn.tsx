"use client";
import DashboardBtnTemplate from "./dashboardBtnTemplate";
import { useCreateCollectionModal } from "../_dashboardModals/createCollectionModal/useCreateCollection";

function CreateCollectionBtn() {
    const { showCreateCollectionModal } = useCreateCollectionModal();
    const viewAllHandler = () => {};
    const btnHandler = () => {
        showCreateCollectionModal();
    };
    return (
        <DashboardBtnTemplate
            btnText="Create New Collection"
            viewAllHandler={viewAllHandler}
            btnHandler={btnHandler}
        />
    );
}

export default CreateCollectionBtn;
