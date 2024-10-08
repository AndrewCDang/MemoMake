import React from "react";
import style from "./landing.module.scss";
import CrescentCards from "../crescentCards/crescentCards";
import { FlashmuLandingLogo } from "@/app/_components/svgs/svgs";
import TryOrCreate from "./tryOrCreate";
import TryOrCreateMobile from "./tryOrCreateMobile";

function Landing() {
    return (
        <>
            <section className={style.landingContainer}>
                <div className={style.landingTextContainer}>
                    <div>
                        <div className={style.flashmuLogo}>
                            <FlashmuLandingLogo />
                        </div>
                        <h1 className={style.flashmuLandingTextLogo}>Quizmu</h1>

                        <div className={style.landingTextWrap}>
                            <h5 className={style.leadingText}>
                                <span>Create</span> | <span> Test</span> |
                                <span> Share</span>
                            </h5>

                            <h5>flashcards quizzes.</h5>
                        </div>
                    </div>
                    <div className={style.createSetBtn}>
                        <TryOrCreate />
                    </div>
                </div>
                <CrescentCards />
            </section>
            <div className={style.mobileBtns}>
                <TryOrCreateMobile />
            </div>
        </>
    );
}

export default Landing;
