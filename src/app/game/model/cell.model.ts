import { Color } from './color.model';

export type Cell = {
  color: Color;
  isFree: boolean;
};
export type Coordinates = { x: number; y: number };
