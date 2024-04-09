import { db } from "./db";
import { v4 as uuidV4 } from "uuid";
import { getVerificationByEmail } from "./verificationToken";

const generateVerificationToken = async (email: string) => {
    const verificationToken = uuidV4();

    const existingToken = await getVerificationByEmail(email);

    if (existingToken) {
        try {
            await db`
                DELETE FROM verification_token
                WHERE id = ${existingToken.id as string}
            `;
        } catch (error) {
            console.error("Error deleting existing token:", error);
            return null;
        }
    }

    try {
        const expires = new Date(new Date().getTime() + 3600 * 1000);
        await db`
            INSERT INTO verification_token (email, token, expires)
            VALUES(${email},${verificationToken},${expires})
        `;

        return {
            success: true,
            message: "Verification token created",
            token: verificationToken,
        };
    } catch (error) {
        console.error("Error creating new token:", error);
        return null;
    }
};

export default generateVerificationToken;
