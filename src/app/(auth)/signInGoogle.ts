"use client";
import { signIn } from "next-auth/react";
import { defaultLogInRedirect } from "@/routes";

async function signInGoogle() {
    signIn("google", {
        callbackUrl: defaultLogInRedirect,
    }).catch((error) => console.error("Sign in error:", error));
}

export default signInGoogle;
