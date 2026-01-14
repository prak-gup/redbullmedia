/**
 * Formats a currency value with Indian numbering system
 * @param value - The numeric value to format
 * @returns Formatted currency string (₹X Cr/L/K)
 */
export function formatCurrency(value: number): string {
  if (value >= 10000000) return `₹${(value / 10000000).toFixed(2)} Cr`
  if (value >= 100000) return `₹${(value / 100000).toFixed(2)} L`
  if (value >= 1000) return `₹${(value / 1000).toFixed(1)}K`
  return `₹${value.toFixed(0)}`
}

/**
 * Formats a number with Indian numbering system
 * @param value - The numeric value to format
 * @returns Formatted number string (X Cr/L/K)
 */
export function formatNumber(value: number): string {
  if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`
  if (value >= 100000) return `${(value / 100000).toFixed(1)} L`
  if (value >= 1000) return `${(value / 1000).toFixed(1)}K`
  return value.toLocaleString()
}

/**
 * Formats a percentage value
 * @param value - The percentage value
 * @param decimals - Number of decimal places (default: 1)
 * @returns Formatted percentage string
 */
export function formatPct(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`
}
