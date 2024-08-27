"use client";
import { useRef, useEffect } from "react";
import {
    UseFormGetValues,
    UseFormSetError,
    FieldErrors,
} from "react-hook-form";
import { PasswordSchema } from "../../schema/authSchema";
import { ZodError } from "zod";
import style from "./authForm.module.scss";
import { useState } from "react";
import { ValidIcon } from "./_components/validIcons";

// Define the base type for all fields
type FormValues = {
    password: string;
    email: string;
    userName: string;
    confirmPassword: string;
};

// Create a type that makes all fields except for 'password' optional
type GetValuesType = {
    password: string;
} & Partial<Omit<FormValues, "password">>;

export const passwordRequirements = [
    {
        description: "Have a minimum of 8 characters",
        test: (password: string) => password.length >= 8,
    },
    {
        description: "Contain an upper case letter",
        test: (password: string) => /[A-Z]/.test(password),
    },
    {
        description: "Contain a lower case letter",
        test: (password: string) => /[a-z]/.test(password),
    },
    {
        description: "Contain at least one 0-9 digit",
        test: (password: string) => /\d/.test(password),
    },
];

function PasswordRequirements<T extends FormValues | GetValuesType>({
    errors,
    setError,
    getValues,
}: {
    errors: FieldErrors<GetValuesType>;
    setError: UseFormSetError<T>;
    getValues: UseFormGetValues<T>;
}) {
    const [validState, setValidState] = useState<(boolean | null)[]>(
        new Array(passwordRequirements.length).fill(null)
    );

    const touhedRef = useRef(false);
    const passwordRef = useRef(true);

    const checkPassword = (password: string) => {
        const validArray = passwordRequirements.map((req) =>
            req.test(password)
        );
        setValidState(validArray);
    };

    useEffect(() => {
        if (errors.password?.message && passwordRef.current) {
            const password = getValues("password" as any);

            try {
                PasswordSchema.parse({ password: password });
            } catch (error) {
                if (error instanceof ZodError) {
                    const errorsArray = [] as string[];
                    error.errors.forEach((err) => {
                        errorsArray.push(err.message);
                    });
                    passwordRef.current = false;
                    setError("password" as any, {
                        type: "custom",
                        message: errorsArray.join("~"),
                    });
                } else {
                    console.error("Unexpected error:", error);
                }
            }
        } else if (passwordRef.current === false) {
            passwordRef.current = true;
        }
    }, [errors.password]);

    useEffect(() => {
        if (errors.password && touhedRef.current == false) {
            touhedRef.current = true;
        }
        if (touhedRef.current) {
            const password = getValues("password" as any);
            checkPassword(password);
        }
    }, [errors.password]);

    return (
        <div className={style.passwordRequirementsContainer}>
            <span>Your password should:</span>
            <ul className={style.passwordRequirements}>
                {passwordRequirements.map((item, index) => {
                    return (
                        <div key={index}>
                            <ValidIcon valid={validState[index]} />
                            <li key={index}>{item.description}</li>
                        </div>
                    );
                })}
            </ul>
        </div>
    );
}

export default PasswordRequirements;
