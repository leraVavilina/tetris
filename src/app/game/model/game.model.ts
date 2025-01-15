export type Speed = 'fast' | 'default' | 'slow';
export const SPEED_MAP: Record<Speed, number> = {
  default: 1000,
  fast: 100,
  slow: 3000,
};
