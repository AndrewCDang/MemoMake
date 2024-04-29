import { colours } from "@/app/styles/colours";

function diffColour({ diff, alpha }: { diff: string; alpha?: number }) {
    switch (diff) {
        case "NA":
            return colours.grey(alpha);
        case "EASY":
            return colours.green(alpha);
        case "MEDIUM":
            return colours.yellow(alpha);
        case "HARD":
            return colours.red(alpha);
        default:
            break;
    }
}

export default diffColour;
