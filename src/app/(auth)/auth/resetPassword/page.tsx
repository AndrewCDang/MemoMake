"use client";
import React, { useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import resetPasswordRequest from "@/app/_actions/resetPasswordRequest";
import { useRouter } from "next/navigation";
import SubmitMessage from "../../_components/submitResults/submitMessage";
import style from "./resetPassword.module.scss";
import ResetPasswordForm from "./resetPasswordForm";

function page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationRef = useRef<boolean>(false);

    const [verificationStatus, setVerificationStatus] = useState<
        boolean | null
    >(null);

    const verificationHandler = async ({ token }: { token: string }) => {
        const verifyAccount = await resetPasswordRequest({ token });
        if (verifyAccount?.success) {
            setVerificationStatus(true);
        } else {
            setVerificationStatus(false);
        }
    };

    useEffect(() => {
        const paramsToken = searchParams.get("token");
        if (paramsToken && !verificationRef.current) {
            verificationHandler({ token: paramsToken });

            verificationRef.current = true;
        }
        if (!paramsToken) {
            setVerificationStatus(false);
        }
    }, [searchParams]);

    return (
        <section className={style.verifyPage}>
            <section className={style.verifyContainer}>
                {verificationStatus === false && (
                    <>
                        <SyncLoader />
                        <h3>Error</h3>
                        <SubmitMessage
                            validated={false}
                            message="Verification link expired or invalid."
                        />
                    </>
                )}
                {verificationStatus === null && (
                    <>
                        <SyncLoader />
                        <h3>Verifying reset link</h3>
                    </>
                )}
                {verificationStatus && (
                    <ResetPasswordForm
                        token={searchParams.get("token") as string}
                    />
                )}
            </section>
        </section>
    );
}

export default page;
