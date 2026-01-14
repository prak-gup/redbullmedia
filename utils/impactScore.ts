/**
 * Gets styling classes for impact score based on value
 * @param score - Impact score (0-100)
 * @returns Object with color and background classes
 */
export function getImpactScoreStyle(score: number): { color: string; bg: string } {
  if (score >= 85) return { color: 'text-emerald-600', bg: 'bg-emerald-500' }
  if (score >= 70) return { color: 'text-cyan-600', bg: 'bg-cyan-500' }
  if (score >= 55) return { color: 'text-amber-600', bg: 'bg-amber-500' }
  return { color: 'text-rose-600', bg: 'bg-rose-500' }
}
