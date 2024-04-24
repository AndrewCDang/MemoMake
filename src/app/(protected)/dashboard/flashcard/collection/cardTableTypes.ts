// Names of columns
export type ColumnName =
    | "item_question"
    | "item_answer"
    | "item_tags"
    | "difficulty"
    | "last_modified";

// Column Widths
export type ColsWidthType = {
    [key in ColumnName]?: number;
};

// Edit Item Logic
export interface Refs<T> {
    [key: string]: T | null;
}

// Storing Edited Popover values into states
export interface InputValues {
    [key: string]: string | string[] | undefined;
}
