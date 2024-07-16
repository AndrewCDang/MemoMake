"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import style from "./navUser.module.scss";
import React, { ReactNode, useState } from "react";
import { LuUser } from "react-icons/lu";
import ClipHoverBtn from "@/app/_components/(buttons)/clipHoverBtn/clipHoverBtn";
import { HiUser } from "react-icons/hi2";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import Link from "next/link";
import { useLogInModal } from "@/app/_hooks/useLogIn";
import { useSignUpModal } from "@/app/_hooks/useSignUp";

function NavLoggedIn({ session }: { session: Session | null }) {
    const [openDropdown, setOpenDropdown] = useState<boolean>(false);
    // const form = (
    //     <form
    //         action={async () => {
    //             "use server";
    //             await signOut();
    //         }}
    //     >
    //         <button>Sign Out</button>
    //     </form>
    // );

    const { showLogInModal } = useLogInModal();
    const { showSignUpModal } = useSignUpModal();

    const signOutHandler = async () => {
        try {
            console.log("signout");
            await signOut();
        } catch (error) {
            console.log("Error during sign out:", error);
        }
    };

    const DropdownItem = ({
        children,
        handler = () => null,
    }: {
        children: ReactNode;
        handler?: () => void;
    }) => {
        return (
            <button onClick={handler} className={style.dropdownItem}>
                {children}
            </button>
        );
    };

    return (
        <section className={style.navBtnWrap}>
            {!session?.user && (
                <button
                    onClick={showSignUpModal}
                    className={style.createAccountBtn}
                >
                    <span className={style.textWidth}>Create Account</span>
                    <span className={style.baseText}>Create Account</span>
                    <span className={style.hoverText}>Create Account</span>
                </button>
            )}
            <div className={style.navBtn}>
                <button
                    onClick={() => setOpenDropdown((state) => !state)}
                    className={style.defaultUser}
                >
                    <ClipHoverBtn
                        hoverChild={
                            <div className={style.hoverChild}>
                                <LuUser />
                            </div>
                        }
                        baseChild={
                            <div className={style.baseChild}>
                                <LuUser />
                            </div>
                        }
                    />
                </button>
            </div>
            <div
                className={style.dropDownWrap}
                onClick={() => setOpenDropdown(false)}
            >
                <PopOverContent
                    isOn={openDropdown}
                    animation="stylised"
                    setIsOn={setOpenDropdown}
                >
                    {session && session.user ? (
                        <div className={style.dropDownContainer}>
                            <Link href="/dashboard">
                                <DropdownItem>
                                    <span>Dashboard</span>
                                    {session.user && session.user.image ? (
                                        <img src={session.user.image}></img>
                                    ) : (
                                        <div className={style.defaultUser}>
                                            <HiUser />
                                        </div>
                                    )}
                                </DropdownItem>
                            </Link>
                            <DropdownItem handler={signOutHandler}>
                                <>
                                    <span>Sign Out</span>
                                    <HiOutlineArrowRightOnRectangle />
                                </>
                            </DropdownItem>
                        </div>
                    ) : (
                        <div className={style.dropDownContainer}>
                            <DropdownItem>
                                <>
                                    <span onClick={() => showLogInModal()}>
                                        Sign In
                                    </span>
                                    <HiOutlineArrowRightOnRectangle />
                                </>
                            </DropdownItem>
                        </div>
                    )}
                </PopOverContent>
            </div>
        </section>
    );
}

export default NavLoggedIn;
