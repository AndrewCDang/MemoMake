import style from "./validIcon.module.scss";

const validIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m4.5 12.75 6 6 9-13.5"
        />
    </svg>
);

const xIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18 18 6M6 6l12 12"
        />
    </svg>
);

const nullIcon = (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6"
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
    </svg>
);

export const ValidIcon = ({ valid = null }: { valid: boolean | null }) => {
    return (
        <div
            className={`
            ${style.verifyIcon}
            ${valid === false && style.passwordInvalid}
            ${valid === true && style.passwordValid}
            ${valid === null && style.passwordNull}
        `}
        >
            {valid === null && nullIcon}
            {valid === true && validIcon}
            {valid === false && xIcon}
        </div>
    );
};
