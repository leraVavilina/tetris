import { FigureType, FigureView } from './tetris-component.model';

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
