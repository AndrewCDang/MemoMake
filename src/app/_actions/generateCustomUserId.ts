"use server";

import crypto from "crypto";
import { v4 as uuidv4, validate as uuidValidate } from "uuid";

async function generateCustomUserId(
    email: string,
    sub: string
): Promise<string> {
    const seed = `${email}:${sub}`;
    const hash = crypto.createHash("sha256").update(seed).digest("hex");

    // Convert the hash to a UUID v4 format
    const uuidBytes = new Uint8Array(16);
    for (let i = 0; i < 16; i++) {
        uuidBytes[i] = parseInt(hash.slice(i * 2, i * 2 + 2), 16);
    }

    // Set the version to 4 (UUID v4)
    uuidBytes[6] = (uuidBytes[6] & 0x0f) | 0x40;

    // Set the variant to 0b10xxxxxx (RFC 4122 variant)
    uuidBytes[8] = (uuidBytes[8] & 0x3f) | 0x80;

    const uuidString = uuidv4({
        random: uuidBytes,
    });

    // Validate the generated UUID
    if (!uuidValidate(uuidString)) {
        throw new Error("Failed to generate a valid UUID v4");
    }

    return uuidString as string;
}

export default generateCustomUserId;
