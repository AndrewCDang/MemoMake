import React from "react";
import style from "./landing.module.scss";
import CrescentCards from "../crescentCards/crescentCards";
import {
    FlashmuLandingLogo,
    FlashmuLogo,
    LandingCurvedArrow,
} from "@/app/_components/svgs/svgs";
import Button from "@/app/_components/(buttons)/styledButton";
import DefaultButton from "@/app/_components/(buttons)/defaultButton";

function Landing() {
    return (
        <section className={style.landingContainer}>
            <div className={style.landingTextContainer}>
                <div>
                    <FlashmuLandingLogo />
                    <h1 className={style.flashmuLandingTextLogo}>Flashmu</h1>
                    <div>
                        <h5 className={style.leadingText}>
                            <span>fun</span>, <span> stylish</span>,
                            <span> productive</span>
                        </h5>
                        <h5>flashcard and quizzes.</h5>
                    </div>
                </div>
                <div className={style.btnContainer}>
                    <DefaultButton variant="yellow">
                        <h5>Wanna try?</h5>
                    </DefaultButton>
                    <div>
                        <h5 className={style.subText}>
                            <span className={style.underline}>Click</span> on
                            one of these sets
                        </h5>
                    </div>
                    {Array(3)
                        .fill(0)
                        .map((item, index) => {
                            return (
                                <div
                                    key={index}
                                    className={style.arrowsContainer}
                                >
                                    <LandingCurvedArrow />
                                </div>
                            );
                        })}
                </div>
            </div>
            <CrescentCards />
        </section>
    );
}

export default Landing;
