/**
 * Safely format numeric values with locale-aware thousand separators.
 * Guarantees zero crashes if value is undefined, null, NaN, or non-numeric.
 */
export const formatNumber = (
  value: number | string | null | undefined,
  fallback: string = '---'
): string => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    return fallback;
  }
  return num.toLocaleString();
};

/**
 * Safely format percentage differences with leading '+' for positive values.
 */
export const formatPercent = (
  value: number | string | null | undefined,
  fallback: string = '0%'
): string => {
  if (value === null || value === undefined || value === '') {
    return fallback;
  }
  const num = typeof value === 'number' ? value : Number(value);
  if (isNaN(num)) {
    return fallback;
  }
  return `${num > 0 ? `+${num}` : num}%`;
};
