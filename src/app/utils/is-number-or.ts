import isNumber from 'is-number';

export function isNumberOr(value: any, fallback = 0): number {
  return isNumber(value) ? Number(value) : fallback;
}
