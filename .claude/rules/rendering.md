# Rendering Rules

Applies to: `src/render/**`

## Determinism (CRITICAL)

- **ALWAYS normalize timestamps** to canonical UTC before processing
- **Sort by timestamp first, then GUID** for tie-breaking
- **NEVER introduce randomization** or environment-dependent ordering
- Verify with `verifyDeterminism()` for critical changes

## TimeOfDay Classification (UTC)

| Period | Hours (UTC) |
|--------|-------------|
| Morning | 00:00-11:59 (0-11) |
| Afternoon | 12:00-17:59 (12-17) |
| Evening | 18:00-23:59 (18-23) |

## Blockquote Nesting

- Level 0 (direct reply): `> **Sender**: text`
- Level N: `>`.repeat(N+1) with 2*N space indent
- **ALWAYS guard against circular refs** with visited Set

```typescript
const visited = new Set<string>()
function buildReplyTree(message: Message) {
  if (visited.has(message.guid)) return // Cycle guard
  visited.add(message.guid)
  // ... recurse
}
```

## Embed Syntax

- Obsidian wikilinks: `![[path]]`
- HEIC/TIFF previews: append `.jpg` to original path
- Only images are embedded (`mediaKind === 'image'`)

## Pure Functions

- All sort operations return new arrays (`[...arr].sort()`)
- No side effects in render functions
- Use guard clauses for early returns
- Use accessor functions: `getEmbedPath()`, `getTranscriptions()`
