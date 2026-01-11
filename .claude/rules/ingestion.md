# Ingestion Rules

Applies to: `src/ingest/**`

## Data Transformation

- CSV rows may produce multiple messages (text + media) — handle as array
- GUID formats:
  - CSV: `csv:{line}:{part}` or `csv:{line}:{part}:media`
  - DB splits: `p:{index}/{originalGuid}`
- Date conversion:
  - CSV: ISO 8601 string → UTC with `Z` suffix
  - DB: Apple epoch (add 978307200 seconds)
- **ALWAYS use `groupGuid`** to link split message parts

## Deduplication

- **Primary:** Exact GUID match (O(1) Map lookup)
- **Secondary:** Content equivalence via normalized text index
- Text normalization: lowercase, trim, remove punctuation, collapse whitespace
- Index key: `{handle}:{normalizedText}`
- **DB is authoritative** for timestamps, handle, associations when merging

## Reply/Tapback Linking

Use minute-based time buckets for O(1) candidate lookup.

**Scoring weights:**

| Factor | Points |
|--------|--------|
| Snippet `startsWith` | +100 |
| Media candidate | +80 |
| Snippet `includes` | +50 |
| Timestamp <30s | +20 |
| Same sender | +15 |
| Same group | +10 |

Track ambiguous links (ties) in `AmbiguousLink[]` for debugging.

## Validation

- Run Zod schema validation after transformation
- Invalid dates: Skip row (return empty array)
- Missing attachment paths: Skip media message creation

## Anti-Patterns to Avoid

- **Do NOT** duplicate `inferMediaKind()` — use shared utility
- **Do NOT** use empty `catch {}` — log errors at minimum
- **Do NOT** use `as Message` casts — build complete objects
- **Do NOT** hardcode time windows — make configurable
