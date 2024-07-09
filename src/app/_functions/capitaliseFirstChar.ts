export const capitaliseFirstChar = (string: string) => {
    if (string === " ") return " ";
    if (string === "") return "";
    return string[0].toUpperCase() + string.slice(1);
};
