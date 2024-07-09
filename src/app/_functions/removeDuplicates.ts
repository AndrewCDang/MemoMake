export const removeDuplicates = (arg: string[]) => {
    const removedDuplicatesArray = arg.filter(
        (item, index, array) => array.indexOf(item) === index
    );

    return removedDuplicatesArray;
};
