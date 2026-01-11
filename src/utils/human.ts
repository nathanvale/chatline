/**
 * Human Output Helper
 *
 * Centralizes human-facing console output so we can globally toggle it
 * (e.g. suppressed when --json or LOG_FORMAT=json-only is active).
 * Tests that spy on console.* remain compatible.
 */

export type HumanLoggerOptions = {
	enabled?: boolean
}

let humanEnabled = true

/**
 * Enable or disable human-facing console output globally.
 * Useful for suppressing output when LOG_FORMAT=json-only or --json flag is set.
 *
 * @param enabled - Whether to enable human output
 */
export function setHumanLoggingEnabled(enabled: boolean): void {
	humanEnabled = enabled
}

function safeConsole<K extends 'info' | 'warn' | 'error' | 'log'>(
	kind: K,
	...args: Array<unknown>
): void {
	if (!humanEnabled) return
	const c = (
		globalThis as unknown as {
			console?: Record<string, (...a: unknown[]) => void>
		}
	).console
	c?.[kind]?.(...(args as []))
}

/**
 * Output info-level human-facing console message.
 * Respects global humanEnabled flag (can be suppressed with setHumanLoggingEnabled).
 *
 * @param args - Arguments to pass to console.info
 */
export function humanInfo(...args: Array<unknown>): void {
	safeConsole('info', ...args)
}

/**
 * Output warning-level human-facing console message.
 * Respects global humanEnabled flag (can be suppressed with setHumanLoggingEnabled).
 *
 * @param args - Arguments to pass to console.warn
 */
export function humanWarn(...args: Array<unknown>): void {
	safeConsole('warn', ...args)
}

/**
 * Output error-level human-facing console message.
 * Respects global humanEnabled flag (can be suppressed with setHumanLoggingEnabled).
 *
 * @param args - Arguments to pass to console.error
 */
export function humanError(...args: Array<unknown>): void {
	safeConsole('error', ...args)
}
