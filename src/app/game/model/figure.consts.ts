import { Color } from './color.model';

export const FIGURE_VIEW: Record<FigureType, FigureView> = {
  O: [
    [1, 1],
    [1, 1],
  ],
  I: [[1], [1], [1], [1]],
  S: [
    [0, 1, 1],
    [1, 1, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
  ],
  L: [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  J: [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
  T: [
    [1, 1, 1],
    [0, 1, 0],
  ],
};

export function isFigureType(view: any): view is FigureType {
  if (view && FigureType.includes(view)) {
    return true;
  }
  return false;
}

export type FigureView = (0 | 1)[][];
export const FigureType = ['O', 'I', 'S', 'Z', 'L', 'J', 'T'] as const;
export type FigureType = (typeof FigureType)[number];

export type Figure = {
  color: Color;
  type: FigureType;
};
