"use client";
import { Session } from "next-auth";
import { signOut } from "next-auth/react";
import style from "./navUser.module.scss";
import React, { ReactNode, useState } from "react";
import { LuUser } from "react-icons/lu";
import ClipHoverBtn from "@/app/_components/(buttons)/clipHoverBtn/clipHoverBtn";
import { HiUser } from "react-icons/hi2";
import { HiOutlineArrowRightOnRectangle } from "react-icons/hi2";
import PopOverContent from "@/app/_components/_generalUi/popOverContent/popOverContent";
import Link from "next/link";
import { useLogInModal } from "@/app/_hooks/useLogIn";
import { useSignUpModal } from "@/app/_hooks/useSignUp";
import FlipBtn from "@/app/_components/(buttons)/flipBtn/flipBtn";
import { FiUser } from "react-icons/fi";
import { FiUserPlus } from "react-icons/fi";
import { FiUserMinus } from "react-icons/fi";

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
                <FlipBtn
                    baseText="Create Account"
                    hoverText="Create Account"
                    handler={showSignUpModal}
                />
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
                                    <FiUserMinus />
                                </>
                            </DropdownItem>
                        </div>
                    ) : (
                        <div className={style.dropDownContainer}>
                            <DropdownItem>
                                <>
                                    <span onClick={() => showLogInModal()}>
                                        Log In
                                    </span>
                                    <div style={{ paddingRight: "0.125rem" }}>
                                        <FiUser />
                                    </div>
                                </>
                            </DropdownItem>
                            <DropdownItem>
                                <>
                                    <span onClick={() => showLogInModal()}>
                                        Sign Up
                                    </span>
                                    <FiUserPlus />
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
