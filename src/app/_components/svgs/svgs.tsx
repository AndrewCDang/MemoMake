import styles from "./svgs.module.scss";

export function Circle() {
    return (
        <>
            <svg
                className="icon"
                version="1.1"
                id="a"
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                viewBox="0 0 386 386"
            >
                <path d="M193,0c106.6,0,193,86.4,193,193s-86.4,193-193,193S0,299.6,0,193S86.4,0,193,0z" />
            </svg>
        </>
    );
}

export function Triangle() {
    return (
        <svg
            className="icon"
            version="1.1"
            id="a"
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            viewBox="0 0 230 230"
        >
            <path d="M115,0L0,230h230L115,0z" />
        </svg>
    );
}

export function Square() {
    return <div></div>;
}

export function RightArrow() {
    return (
        <svg
            id="a"
            data-name="Layer 1"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 203 364"
        >
            <path d="M22,364c-5,0-11-2-15-6-8-8-8-21,0-30L151,182,6,36C-2,28-2,15,6,6c8-8,21-8,30,0L197,167c4,4,6,9,6,15s-2,11-6,15L37,358c-5,4-10,6-15,6Z" />
        </svg>
    );
}
export function XSvg() {
    return (
        <svg
            viewBox="-8.5 0 32 32"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
        >
            <title>close</title>
            <path d="M8.48 16l5.84-5.84c0.32-0.32 0.32-0.84 0-1.2-0.32-0.32-0.84-0.32-1.2 0l-5.84 5.84-5.84-5.84c-0.32-0.32-0.84-0.32-1.2 0-0.32 0.32-0.32 0.84 0 1.2l5.84 5.84-5.84 5.84c-0.32 0.32-0.32 0.84 0 1.2 0.16 0.16 0.4 0.24 0.6 0.24s0.44-0.080 0.6-0.24l5.84-5.84 5.84 5.84c0.16 0.16 0.36 0.24 0.6 0.24 0.2 0 0.44-0.080 0.6-0.24 0.32-0.32 0.32-0.84 0-1.2l-5.84-5.84z"></path>
        </svg>
    );
}

export function ArrowBracketSVG({}) {
    return (
        <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15.9629 52.1839L36.7809 31.3659C38.5383 29.6085 41.3875 29.6085 43.1449 31.3659L63.9629 52.1839"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

import "./loadingSpin.css";
import Link from "next/link";
import { PiCirclesFourFill } from "react-icons/pi";

export const LoadingSpin = () => {
    return (
        <div id="wrapper">
            <div className="profile-main-loader w-4">
                <div className="loader">
                    <svg
                        style={{ strokeWidth: 8 }}
                        className="circular-loader"
                        viewBox="25 25 50 50"
                    >
                        <circle
                            className="loader-path"
                            cx="50"
                            cy="50"
                            r="20"
                            fill="none"
                        />
                    </svg>
                </div>
            </div>
        </div>
    );
};
export default LoadingSpin;

export const CollectionIcon = () => {
    return (
        <svg
            width="43"
            height="49"
            viewBox="0 0 43 49"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M19.3274 16.5776L38.3274 9.79238C39.6299 9.32724 41 10.2928 41 11.6759V35.7542C41 36.6041 40.4629 37.3612 39.6607 37.6419L20.6607 44.2919C19.3604 44.7471 18 43.7819 18 42.4042V18.4611C18 17.6159 18.5314 16.8619 19.3274 16.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="4"
            />
            <path
                d="M11.3274 13.5776L30.3274 6.79238C31.6299 6.32724 33 7.29284 33 8.67588V32.7542C33 33.6041 32.4629 34.3612 31.6607 34.6419L12.6607 41.2919C11.3604 41.7471 10 40.7819 10 39.4042V15.4611C10 14.6159 10.5314 13.8619 11.3274 13.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="4"
            />
            <path
                d="M3.32737 10.5776L22.3274 3.79238C23.6299 3.32724 25 4.29284 25 5.67588V29.7542C25 30.6041 24.4629 31.3612 23.6607 31.6419L4.66071 38.2919C3.36035 38.7471 2 37.7819 2 36.4042V12.4611C2 11.6159 2.53136 10.8619 3.32737 10.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="4"
            />
        </svg>
    );
};

export const SetIcon = () => {
    return (
        <svg viewBox="0 0 27 43" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M3.32737 10.5776L22.3274 3.79238C23.6299 3.32724 25 4.29284 25 5.67588V29.7542C25 30.6041 24.4629 31.3612 23.6607 31.6419L4.66071 38.2919C3.36035 38.7471 2 37.7819 2 36.4042V12.4611C2 11.6159 2.53136 10.8619 3.32737 10.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="4"
            />
        </svg>
    );
};

export const MulitpleSetsIcon = () => {
    return (
        <svg viewBox="0 0 62 87" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M18.3274 10.5776L37.3274 3.79238C38.6299 3.32724 40 4.29284 40 5.67588V29.7542C40 30.6041 39.4629 31.3612 38.6607 31.6419L19.6607 38.2919C18.3604 38.7471 17 37.7819 17 36.4042V12.4611C17 11.6159 17.5314 10.8619 18.3274 10.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="6"
            />
            <path
                d="M3.32737 54.5776L22.3274 47.7924C23.6299 47.3272 25 48.2928 25 49.6759V73.7542C25 74.6041 24.4629 75.3612 23.6607 75.6419L4.66071 82.2919C3.36035 82.7471 2 81.7819 2 80.4042V56.4611C2 55.6159 2.53136 54.8619 3.32737 54.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="6"
            />
            <path
                d="M38.3274 42.5776L57.3274 35.7924C58.6299 35.3272 60 36.2928 60 37.6759V61.7542C60 62.6041 59.4629 63.3612 58.6607 63.6419L39.6607 70.2919C38.3604 70.7471 37 69.7819 37 68.4042V44.4611C37 43.6159 37.5314 42.8619 38.3274 42.5776Z"
                fill="white"
                stroke="black"
                strokeWidth="6"
            />
        </svg>
    );
};

export const FlashmuLogo = () => {
    return (
        <div className={styles.logoContainer}>
            <Link href={"/"}>
                <svg
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        fill="white"
                        stroke="black"
                        strokeWidth="1.5"
                        d="M10.9,24.1l-2.3,8c0,0.1-0.1,0.2-0.2,0.2h-7c-0.2,0-0.3-0.2-0.2-0.3l2.3-8c0-0.1,0.1-0.2,0.2-0.2h7
	C10.8,23.8,11,23.9,10.9,24.1z"
                    />
                    <path
                        fill="#FFC700"
                        d="M22.1,23c0.7,0,1.1,0.6,1,1.3l-2.3,8c-0.1,0.4-0.5,0.7-1,0.7h-7c-0.7,0-1.1-0.6-1-1.3l2.3-8
	c0.1-0.4,0.5-0.7,1-0.7H22.1z"
                    />
                    <path
                        fill="white"
                        stroke="black"
                        strokeWidth="1.5"
                        d="M18.9,1.1l-2.5,8c0,0.1-0.1,0.2-0.2,0.2H8.4c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2h7.8
	C18.8,0.8,18.9,0.9,18.9,1.1z"
                    />
                    <path
                        fill="white"
                        stroke="black"
                        strokeWidth="1.5"
                        d="M30.3,1.1l-2.5,8c0,0.1-0.1,0.2-0.2,0.2h-7.8c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2H30
	C30.2,0.8,30.3,0.9,30.3,1.1z"
                    />
                    <path
                        fill="white"
                        stroke="black"
                        strokeWidth="1.5"
                        d="M15.4,12.6l-2.5,8c0,0.1-0.1,0.2-0.2,0.2H4.9c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2h7.8
	C15.3,12.2,15.4,12.4,15.4,12.6z"
                    />
                    <path
                        fill="white"
                        stroke="black"
                        strokeWidth="1.5"
                        d="M26.8,12.6l-2.5,8c0,0.1-0.1,0.2-0.2,0.2h-7.8c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2h7.8
	C26.7,12.3,26.8,12.4,26.8,12.6z"
                    />
                </svg>
            </Link>
        </div>
    );
};

export const FlashmuLandingLogo = () => {
    return (
        <div className={styles.flashmuLandingLogo}>
            <svg
                viewBox="0 0 32 33"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="white"
                    stroke="black"
                    strokeWidth="1.5"
                    d="M10.9,24.1l-2.3,8c0,0.1-0.1,0.2-0.2,0.2h-7c-0.2,0-0.3-0.2-0.2-0.3l2.3-8c0-0.1,0.1-0.2,0.2-0.2h7
	C10.8,23.8,11,23.9,10.9,24.1z"
                />
                <path
                    fill="#FFC700"
                    d="M22.1,23c0.7,0,1.1,0.6,1,1.3l-2.3,8c-0.1,0.4-0.5,0.7-1,0.7h-7c-0.7,0-1.1-0.6-1-1.3l2.3-8
	c0.1-0.4,0.5-0.7,1-0.7H22.1z"
                />
                <path
                    fill="white"
                    stroke="black"
                    strokeWidth="1.5"
                    d="M18.9,1.1l-2.5,8c0,0.1-0.1,0.2-0.2,0.2H8.4c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2h7.8
	C18.8,0.8,18.9,0.9,18.9,1.1z"
                />
                <path
                    fill="white"
                    stroke="black"
                    strokeWidth="1.5"
                    d="M30.3,1.1l-2.5,8c0,0.1-0.1,0.2-0.2,0.2h-7.8c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2H30
	C30.2,0.8,30.3,0.9,30.3,1.1z"
                />
                <path
                    fill="white"
                    stroke="black"
                    strokeWidth="1.5"
                    d="M15.4,12.6l-2.5,8c0,0.1-0.1,0.2-0.2,0.2H4.9c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2h7.8
	C15.3,12.2,15.4,12.4,15.4,12.6z"
                />
                <path
                    fill="white"
                    stroke="black"
                    strokeWidth="1.5"
                    d="M26.8,12.6l-2.5,8c0,0.1-0.1,0.2-0.2,0.2h-7.8c-0.2,0-0.3-0.2-0.2-0.3l2.5-8c0-0.1,0.1-0.2,0.2-0.2h7.8
	C26.7,12.3,26.8,12.4,26.8,12.6z"
                />
            </svg>
        </div>
    );
};

export const ChangeColourIcons = () => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            className={styles.changeColourIcons}
        >
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path d="M6.5 12a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
            <path d="M17.5 12a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
            <path d="M12 2a5 5 0 1 1 -4.995 5.217l-.005 -.217l.005 -.217a5 5 0 0 1 4.995 -4.783z" />
        </svg>
    );
};

export const LandingCurvedArrow = () => {
    return (
        <svg
            viewBox="0 0 176 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M0.560883 19.1149C0.327113 19.9096 0.781884 20.7434 1.57664 20.9772L14.528 24.7867C15.3228 25.0205 16.1565 24.5657 16.3903 23.7709C16.6241 22.9762 16.1693 22.1424 15.3746 21.9086L3.86224 18.5224L7.24847 7.01006C7.48224 6.2153 7.02747 5.38151 6.23271 5.14774C5.43795 4.91397 4.60416 5.36874 4.37039 6.1635L0.560883 19.1149ZM175.852 30.767C161.117 20.7953 134.785 8.2544 103.511 2.89464C72.2194 -2.46813 35.8894 -0.654728 1.28167 18.2213L2.71817 20.855C36.5872 2.38185 72.1938 0.571231 103.004 5.85153C133.832 11.1348 159.767 23.5042 174.171 33.2516L175.852 30.767Z"
                fill="black"
            />
        </svg>
    );
};
