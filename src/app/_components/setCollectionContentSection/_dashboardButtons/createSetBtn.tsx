"use client";
import { useCreateSetModal } from "@/app/(protected)/dashboard/_dashboardModals/createSetModal/useCreateSetModal";
import DashboardBtnTemplate from "./dashboardBtnTemplate";

function CreateSetBtn() {
    const { showCreateSetModal } = useCreateSetModal();
    const viewAllHandler = () => {};
    const btnHandler = () => {
        showCreateSetModal();
    };
    return (
        <DashboardBtnTemplate
            btnText="Create New Set"
            viewAllHandler={viewAllHandler}
            btnHandler={btnHandler}
        />
    );
}

export default CreateSetBtn;
