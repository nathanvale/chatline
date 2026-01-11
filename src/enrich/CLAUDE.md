# Enrichment Module

AI-powered message enrichment with resumable checkpoints, idempotency, and provider abstraction.

**Stats:** 43 symbols | 13 source files | 10 tests | 95%+ critical path coverage

---

## Structure

```
src/enrich/
├── checkpoint.ts           # Save/resume progress
├── idempotency.ts          # Dedup guards (hasEnrichmentKind)
├── rate-limiting.ts        # Circuit breaker + backoff ← hotspot
├── audio-transcription.ts  # Gemini audio-to-text
├── image-analysis.ts       # Gemini vision
├── link-enrichment.ts      # URL context extraction
├── pdf-video-handling.ts   # PDF summarization
├── progress-tracker.ts     # Progress reporting
├── providers/              # YouTube, Spotify, Twitter, Instagram, Firecrawl, Generic
└── __tests__/              # Integration tests
```

---

## Key Patterns

| Pattern | Why | Key Function |
|---------|-----|--------------|
| **Checkpointing** | Crashes waste expensive API calls | `createCheckpoint()`, `getResumeIndex()` |
| **Idempotency** | Never call API twice for same message | `hasEnrichmentKind()` |
| **Provider chain** | Specialized extraction (YouTube→Generic fallback) | `createProviders()` |
| **Rate limiting** | Backoff on 429/5xx with circuit breaker | `createRateLimiter()` |

---

## Essential Rules

> Full rules: `.claude/rules/enrichment.md`

- **NEVER** run without checkpoints — use `--checkpoint-interval`
- **NEVER** crash on API errors — log and continue
- **ALWAYS** check `hasEnrichmentKind()` before processing
- **ALWAYS** include metadata: provider, model, version, createdAt

---

## Configuration

| Variable | Required | Purpose |
|----------|----------|---------|
| `GEMINI_API_KEY` | Yes | Image/audio enrichment |
| `FIRECRAWL_API_KEY` | No | Link enrichment (generic fallback if missing) |

**CLI:** `bun cli enrich-ai --checkpoint-interval 50`
