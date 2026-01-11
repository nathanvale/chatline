# Source Code Rules

Applies to: `src/**`

## Exports

- **NEVER use default exports** (except CLI entry point)
- **ALWAYS use named exports**: `export { foo }` not `export default foo`
- **Export types explicitly**: `export type { Message }`
- Re-export from index files for public API

## JSDoc

**ALWAYS add JSDoc** for exported functions explaining the "why":

```typescript
/**
 * Converts Apple epoch timestamps to ISO 8601.
 * Apple epoch is nanoseconds since 2001-01-01.
 */
export function convertAppleEpoch(timestamp: number): string
```

## TypeScript

- **No `any`** — use `unknown` + type guards
- **Path aliases required** — `#enrich/*` not `../../enrich`
- **ESM only** — no CommonJS patterns

## Error Handling

Log and degrade gracefully — never crash the pipeline:

```typescript
try {
  const enrichment = await enrichImage(message)
  message.media.enrichment = enrichment
} catch (error) {
  logger.warn({ error, messageId: message.guid }, 'Image enrichment failed')
  // Continue processing other messages
}
```

## Idempotency

Check before enriching to avoid duplicate work:

```typescript
if (hasEnrichmentKind(message, 'image_analysis')) {
  logger.debug({ messageId: message.guid }, 'Already enriched, skipping')
  return message
}
```

## Determinism

**ALWAYS sort for consistency** — same input must produce same output:

```typescript
const sorted = messages.sort((a, b) =>
  a.date === b.date ? a.guid.localeCompare(b.guid) : a.date.localeCompare(b.date)
)
```

## Logging Pattern

```typescript
// Component-scoped logger with colon-separated namespace
const logger = createLogger('utils:delta-detection')

// Always log structured context
logger.info('Delta detected', { newMessages: 42, total: 100 })

// Use humanInfo() for user-facing output (separate from logs)
humanInfo(`Found ${count} new messages to enrich`)
```

## State File Pattern

- Use atomic temp+rename writes: write to `.tmp`, then `rename()`
- Include schema version for forward compatibility
- Return `null` for missing/corrupt files (don't throw)

## Result Type Pattern

```typescript
type FooResult = {
  data: T[]              // Primary output
  statistics: FooStats   // Aggregated metrics
  isFirstRun: boolean    // State flags
}
```
