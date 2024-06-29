import { colours } from "@/app/styles/colours";

export const labelColour = (diff: string) => {
    switch (diff) {
        case "NA":
            return colours.lightGrey();
        case "EASY":
            return colours.green();
        case "MEDIUM":
            return colours.yellow();
        case "HARD":
            return colours.red();
        default:
    }
};
