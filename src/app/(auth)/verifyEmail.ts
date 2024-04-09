import { Resend } from "resend";
import EmailTemplate from "./emailTemplate";

const resend = new Resend(process.env.RESEND_API_KEY);

type VerifyEmail = {
    userName: string;
    token: string;
    email: string;
    subject: string;
    purpose: "verifyEmail" | "resetPassword";
};

export async function verifyEmail({
    userName,
    token,
    subject,
    purpose,
}: VerifyEmail) {
    try {
        const data = await resend.emails.send({
            from: "onboarding@resend.dev",
            to: ["andrew-dang2@hotmail.co.uk"],
            subject: subject,
            react: EmailTemplate({ userName, token, purpose }),
        });
        if (data.data) {
            console.log(data);
        }

        return { status: 200, message: "Verification Email sent" };
    } catch (error) {
        console.log(error);
        return { status: 500, message: "Verification Email Error" };
    }
}
