# Ingestion Module

Parse CSV/DB exports into unified message schema with deduplication, reply linking, and normalization.

**Stats:** 42 symbols | 5 source files | 4 test files | 95%+ critical path coverage

---

## Structure

```
src/ingest/
├── types.ts                        # Shared types (IngestOptions, DBMessage, CSVRow)
├── ingest-csv.ts                   # iMazing CSV → messages
├── ingest-db.ts                    # Messages.app DB → messages
├── dedup-merge.ts                  # GUID + content deduplication
├── link-replies-and-tapbacks.ts    # Time-bucket reply/tapback linking ← hotspot
├── index.ts                        # Barrel export
└── __tests__/                      # 4 integration test files
```

---

## Key Patterns

| Pattern | Why | Key Function |
|---------|-----|--------------|
| **GUID deduplication** | Exact match (O(1) Map) before content analysis | `dedupAndMerge()` |
| **Content equivalence** | Text normalization: lowercase, trim, collapse whitespace | `detectContentEquivalence()` |
| **Time-bucket linking** | O(1) candidate lookup for replies (minute-based buckets) | `linkRepliesToParents()` |
| **DB authoritiveness** | DB timestamps override CSV when merging | `applyDbAuthoritiveness()` |
| **Reply scoring** | snippet match (100) > media (80) > proximity (20) > sender (15) | Score algorithm in linking.ts |

---

## Critical Files

| File | Lines | Purpose |
|------|-------|---------|
| `dedup-merge.ts` | 270 | GUID + content dedup, merge with scoring |
| `link-replies-and-tapbacks.ts` | 380 | Time-bucket matching for replies/reactions |
| `ingest-csv.ts` | 320 | CSV row parsing, attachment resolution |
| `ingest-db.ts` | 180 | Apple epoch conversion, message splitting |
| `types.ts` | 52 | Shared types (consolidated from dedup) |

---

## Essential Rules

> Full rules: `.claude/rules/ingestion.md`

- **NEVER** duplicate `inferMediaKind()` — use `#utils/media-utils`
- **NEVER** use empty `catch {}` — log errors at minimum
- **ALWAYS** use `groupGuid` to link split message parts
- **ALWAYS** verify with `verifyNoDataLoss()` after merge

---

## Data Transformations

| Source | Format | Output | Notes |
|--------|--------|--------|-------|
| CSV | ISO 8601 string | Unified `Message[]` | 1 row → 1+ messages (text + media) |
| DB | Apple epoch (seconds) | Unified `Message[]` | Auto-detects seconds/ms/nanoseconds |
| Merged | GUID-based dedup | Deduplicated array | DB authoritative for timestamps |

**GUID formats:** `csv:{line}:{part}` (CSV) | `p:{index}/{guid}` (DB splits)

---

## Configuration

| Variable | Required | Purpose |
|----------|----------|---------|
| `attachmentRoots` | Yes | Directories to search for media files |
| `messageDate` | No | Optional date filter (YYYY-MM-DD) |

**CLI:** `bun cli ingest-csv file.csv` | `bun cli ingest-db` | `bun cli normalize-link`
