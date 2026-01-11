# Enrichment Rules

Applies to: `src/enrich/**`

## Safety

- **NEVER run enrichment without checkpoints** — Always use `--checkpoint-interval`
- **ALWAYS handle errors gracefully** — Log and continue, never crash

## Checkpointing

Enrichment is resumable. Use checkpoint intervals to save progress:

```bash
bun cli enrich-ai --checkpoint-interval 50
```

## Idempotency

Check `hasEnrichmentKind()` before processing to avoid duplicate API calls:

```typescript
if (hasEnrichmentKind(message, 'image_analysis')) {
  return message // Already processed
}
```

## API Keys

Required environment variables:

- `GEMINI_API_KEY` — Required for image/audio enrichment
- `FIRECRAWL_API_KEY` — Optional for link enrichment

## Error Handling

Enrichment failures should not stop the pipeline:

```typescript
try {
  const result = await enrichImage(message)
  message.media.enrichment = result
} catch (error) {
  logger.warn({ error, messageId: message.guid }, 'Enrichment failed')
  // Continue with next message
}
```

## Provider Abstraction

Providers implement interface:

```typescript
interface Provider {
  name: string        // e.g., 'youtube', 'spotify'
  priority: number    // Lower = higher priority (1-5)
  detect(url: string): boolean
  extract(url: string): Promise<LinkContext>
}
```

- Specialized providers first (YouTube, Spotify, Twitter, Instagram)
- Generic provider as final fallback (priority: 5)

## Rate Limiting

- Use `RateLimiter` class with circuit breaker
- Exponential backoff with ±25% jitter for 429s
- Max retries for 5xx errors (default 3)
- Parse `Retry-After` header (integer seconds or HTTP date)

## AC References

Reference acceptance criteria in comments for traceability:

```typescript
// AC01: Check idempotency before API call
if (hasEnrichmentKind(message, 'image_analysis')) {
  return message
}
```

---

## Provenance

Include metadata on all enrichments:

```typescript
{
  provider: 'gemini-vision',
  model: 'gemini-1.5-flash',
  version: '2026-01-09',
  createdAt: new Date().toISOString()
}
```
