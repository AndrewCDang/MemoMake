"use client";
import { useCreateSetModal } from "@/app/(protected)/dashboard/_dashboardModals/createSetModal/useCreateSetModal";
import DashboardBtnTemplate from "./dashboardBtnTemplate";

function CreateSetBtn() {
    const { showCreateSetModal } = useCreateSetModal();
    const btnHandler = () => {
        showCreateSetModal();
    };
    return (
        <DashboardBtnTemplate
            btnText="Create New Set"
            btnHandler={btnHandler}
        />
    );
}

export default CreateSetBtn;
