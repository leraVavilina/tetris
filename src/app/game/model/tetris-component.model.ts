export type FigureView = (0 | 1)[][];
export const FigureType = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'] as const;
export type FigureType = (typeof FigureType)[number];
