"use client";
import React, { useEffect, useRef, useState } from "react";
import { SyncLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import newVerification from "@/app/_actions/newVerification";
import { useRouter } from "next/navigation";
import SubmitMessage from "../../_components/submitResults/submitMessage";
import style from "./verify.module.scss";

function page() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const verificationRef = useRef<boolean>(false);

    const [verificationStatus, setVerificationStatus] = useState<
        boolean | null
    >(null);

    const verificationHandler = async ({ token }: { token: string }) => {
        const verifyAccount = await newVerification({ token });
        if (verifyAccount?.success) {
            setVerificationStatus(true);
        } else {
            setVerificationStatus(false);
        }
    };

    useEffect(() => {
        setTimeout(() => {
            // router  .push("/");
        }, 1000);
    }, [verificationStatus]);

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
                            message="Verification link expired or invalid. Redirecting to home"
                        />
                    </>
                )}
                {verificationStatus === null && (
                    <>
                        <SyncLoader />
                        <h3>Verifying email</h3>
                    </>
                )}
                {verificationStatus && (
                    <>
                        <h3>Email Verified!</h3>
                        <SubmitMessage
                            validated={true}
                            message="Verification link expired or invalid. Redirecting to home"
                        />
                    </>
                )}
            </section>
        </section>
    );
}

export default page;
