export type Color =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'purple'
  | 'orange'
  | 'pink'
  | 'default';

export const COLOR_MAP: Record<Color, string> = {
  blue: '#93C5FD',
  red: '#FCA5A5',
  green: '#86EFAC',
  yellow: '#FDE047',
  purple: '#D8B4FE',
  orange: '#FDBA74',
  pink: '#F9A8D4',
  default: '#E2E8F0',
};
