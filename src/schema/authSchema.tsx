import { z } from "zod";

export const AuthSchema = z.object({
    email: z.string().min(1, "Email required").email(),
    password: z.string().min(1, "Password required"),
});

export type AuthAccountType = z.infer<typeof AuthSchema>;

export const EmailSchema = z.object({
    email: z.string().min(1, "Email required").email(),
});

export type EmailSchemaType = z.infer<typeof EmailSchema>;

export const AuthSignUp = z
    .object({
        email: z.string().min(1, "Email required").email(),
        userName: z
            .string()
            .min(3, "User name required")
            .min(3, "User name should have at least 3 characters")
            .max(12, "User name should have less than 12 characters"),
        password: z
            .string()
            .min(1, "Password required")
            .min(8, "Password should have a minimum of 8 characters")
            .regex(
                new RegExp(".*[A-Z].*"),
                "Password should contain an upper case letter"
            )
            .regex(
                new RegExp(".*[a-z].*"),
                "Password should contain a lower case letter"
            )
            .regex(
                new RegExp(".*[0-9].*"),
                "Password should contain at least one 0-9 digit"
            ),
        confirmPassword: z.string().min(1, "Password required"),
    })
    .refine((data) => data.confirmPassword === data.password, {
        message: "Passwords don't match",
        path: ["confirmPassword"],
    });

export type AuthSignUpType = z.infer<typeof AuthSignUp>;

export const PasswordSchema = z.object({
    password: z
        .string()
        .min(1, "Password required")
        .min(8, "Password should have a minimum of 8 characters")
        .regex(
            new RegExp(".*[A-Z].*"),
            "Password should contain an upper case letter"
        )
        .regex(
            new RegExp(".*[a-z].*"),
            "Password should contain a lower case letter"
        )
        .regex(
            new RegExp(".*[0-9].*"),
            "Password should contain at least one 0-9 digit"
        ),
});

export type PasswordSchemaType = z.infer<typeof PasswordSchema>;
