export type coloursType =
    | "red"
    | "blue"
    | "blueSelect"
    | "yellow"
    | "green"
    | "white"
    | "grey"
    | "lightGrey"
    | "black"
    | "purple";

export const colours = {
    red: (alpha = 1) => `rgba(255, 86, 120, ${alpha})`,
    blue: (alpha = 1) => `rgba(5, 203, 214, ${alpha})`,
    blueSelect: (alpha = 1) => `rgba(50, 152, 253, ${alpha})`,
    yellow: (alpha = 1) => `rgba(255, 208, 86, ${alpha})`,
    green: (alpha = 1) => `rgba(131, 230, 74, ${alpha})`,
    white: (alpha = 1) => `rgba(256, 256, 256, ${alpha})`,
    grey: (alpha = 1) => `rgba(169, 169, 169, ${alpha})`,
    lightGrey: (alpha = 1) => `rgba(210, 210, 210, ${alpha})`,
    black: (alpha = 1) => `rgba(0, 0, 0, ${alpha})`,
    purple: (alpha = 1) => `rgb(207, 159, 255, ${alpha})`,
};
