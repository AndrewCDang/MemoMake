import { colours } from "@/app/styles/colours";

function diffColour({ diff }: { diff: string }) {
    switch (diff) {
        case "NA":
            return colours.grey();
        case "EASY":
            return colours.green();
        case "MEDIUM":
            return colours.yellow();
        case "HARD":
            return colours.red();
        default:
            break;
    }
}

export default diffColour;
