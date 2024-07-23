export const capitaliseConsecutiveWords = ({
    string,
    firstWord = true,
}: {
    string: string;
    firstWord?: boolean;
}) => {
    if (string === "" || !string) return "";
    const stringArray = string
        .split(" ")
        .map((item) => (item === "" ? " " : item));

    const stringArrayMapped = stringArray.map((item, index) => {
        if (!firstWord && index === 0) {
            return item;
        }
        return (item[0] ? item[0].toUpperCase() : item[0]) + item.slice(1);
    });
    const arrayToString = stringArrayMapped.join(" ");
    return arrayToString;
};
