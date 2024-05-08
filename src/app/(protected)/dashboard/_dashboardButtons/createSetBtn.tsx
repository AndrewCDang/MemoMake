"use client";
import DashboardBtnTemplate from "./dashboardBtnTemplate";
import { useCreateSetModal } from "../_dashboardModals/createSetModal/useCreateSetModal";

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
