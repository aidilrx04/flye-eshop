export function currency(value: number): number {
  return Number((value * 100).toString().split('.')[0]) / 100;
}
