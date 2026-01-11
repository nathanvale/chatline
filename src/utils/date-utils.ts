/**
 * Date Utilities
 *
 * Shared date manipulation functions used across the pipeline.
 */

/**
 * Normalize any ISO-like timestamp to canonical UTC ISO format.
 *
 * - If no timezone designator (no 'Z' and no +/- offset), treat as UTC by appending 'Z'.
 * - Then return Date.toISOString() to canonicalize milliseconds and Z suffix.
 *
 * This ensures deterministic output across different environments and timezones.
 */
export function normalizeIsoUtc(input: string): string {
	const hasZ = /Z$/.test(input)
	const hasOffset = /[+-]\d{2}:?\d{2}$/.test(input)
	const coerced = hasZ || hasOffset ? input : `${input.replace(/\s+$/, '')}Z`
	return new Date(coerced).toISOString()
}
