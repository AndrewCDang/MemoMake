import React from "react";
import categoryStyle from "./categoryInput.module.scss";
import { useRef, useState, useEffect } from "react";
import { HiOutlineX } from "react-icons/hi";
import inputStyle from "../input/inputField.module.scss";
import style from "./categoryInput.module.scss";

type CategoryInputType = {
    categories: string[];
    setCategories: React.Dispatch<React.SetStateAction<string[]>>;
    formRef: React.RefObject<HTMLFormElement>;
    categoryHandler: (arg: string[]) => void;
    setTypedCategory: React.Dispatch<React.SetStateAction<string>>;
};

function LabelInput({
    categories,
    setCategories,
    formRef,
    categoryHandler,
    setTypedCategory,
}: CategoryInputType) {
    const categoryRef = useRef<HTMLInputElement>(null);

    const appendCategory = () => {
        if (categoryRef.current) {
            const categoryValue = categoryRef.current.value.trim();
            const included = categories.includes(categoryValue);
            if (!included) {
                setCategories([...categories, categoryValue]);
                categoryHandler([...categories, categoryValue]);
            }
            categoryRef.current.value = "";
            categoryRef.current.setAttribute("value", "");
        }
    };

    const inputHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === " ") {
            appendCategory();
        }
    };

    const categoryOnBlurHandler = () => {
        setTimeout(() => {
            if (categoryRef.current && categoryRef.current.value.length > 0) {
                appendCategory();
                setTypedCategory("");
            }
        }, 100);
    };

    const removeFromCategory = (category: string) => {
        setCategories((prevState) => {
            const remainingCategories = prevState.filter(
                (item) => item !== category
            );
            return remainingCategories;
        });
        const remainingCategories = categories.filter(
            (item) => item !== category
        );
        categoryHandler(remainingCategories);
    };

    // Event handler that prevents form submission on enter press
    const formEnterHandler = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            e.preventDefault();
        }
    };

    useEffect(() => {
        if (formRef.current) {
            formRef.current.addEventListener("keydown", formEnterHandler);
            return () => {
                if (formRef.current) {
                    formRef.current.removeEventListener(
                        "keydown",
                        formEnterHandler
                    );
                }
            };
        }
    }, [formRef.current]);

    // ----

    return (
        <div>
            <section
                style={{ marginBottom: categories.length > 0 ? "1rem" : "0" }}
                className={categoryStyle.categoriesDisplay}
            >
                {categories.length > 0 &&
                    categories.map((category) => {
                        return (
                            <div key={category}>
                                <span>{category}</span>
                                <div
                                    onClick={() => removeFromCategory(category)}
                                >
                                    <HiOutlineX />
                                </div>
                            </div>
                        );
                    })}
            </section>
            <fieldset className={`${style.inputField} ${inputStyle.fieldset}`}>
                <input
                    type="text"
                    className={categoryStyle.inputField}
                    onKeyUp={(e) => inputHandler(e)}
                    onBlur={() => categoryOnBlurHandler()}
                    onChange={(e) => setTypedCategory(e.target.value)}
                    ref={categoryRef}
                    placeholder=""
                ></input>
                <label>Category</label>
            </fieldset>
        </div>
    );
}

export default LabelInput;
