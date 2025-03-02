export function isNumberOr(value: any, fallback = 0) {
  const toNumber = Number(value);
  const isNan = Number.isNaN(toNumber);

  if (isNan) return fallback;

  return toNumber;
}
