import { MIN_HEIGHT_FIELD, MIN_WIDTH_FIELD, Size } from '../model/field.model';

export function getSizeFromStorage(): Size {
  const parseWidth = localStorage.getItem('width');
  const parseHeight = localStorage.getItem('height');
  let width = MIN_WIDTH_FIELD;
  let height = MIN_HEIGHT_FIELD;
  if (parseWidth) {
    const parse = Number.parseInt(parseWidth);
    if (!Number.isNaN(parse)) {
      width = parse;
    }
  }
  if (parseHeight) {
    const parse = Number.parseInt(parseHeight);
    if (!Number.isNaN(parse)) {
      height = parse;
    }
  }
  return { width, height };
}
