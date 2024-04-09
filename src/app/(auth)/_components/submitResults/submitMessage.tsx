import style from "./submitMessage.module.scss";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import { HiOutlineXCircle } from "react-icons/hi2";

function SubmitMessage({
    validated,
    message,
}: {
    validated: boolean;
    message?: string;
}) {
    if (validated) {
        return (
            <div className={style.success}>
                <HiOutlineCheckCircle />
                <span>{message || "Successfully Verified"}</span>
            </div>
        );
    }

    return (
        <div className={style.error}>
            <HiOutlineXCircle />
            <span>{message || "Verification Error"}</span>
        </div>
    );
}

export default SubmitMessage;
