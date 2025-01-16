import { Color } from '../model/color.model';
import { Figure, FigureType } from '../model/figure.consts';

export function generateFigure(count: number, delta = -3): Figure[] {
  const types: FigureType[] = [];
  while (types.length < count) {
    const type = FigureType[Math.floor(Math.random() * FigureType.length)];
    if (!types.includes(type, delta)) {
      types.push(type);
    }
  }
  const colors: Color[] = [];
  while (colors.length < count) {
    const color = Color[Math.floor(Math.random() * (Color.length - 1))];
    if (!colors.includes(color, delta)) {
      colors.push(color);
    }
  }

  return types.map((type, index) => ({ type, color: colors[index] }));
}
