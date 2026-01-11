# Testing Rules

Applies to: `**/*.test.ts`, `tests/**`

## Coverage Requirements

- **Critical paths:** 95%+ (linking, dedup, enrichment)
- **Overall project:** 70%+ branch coverage (enforced in CI)

## Test Categories

1. **Unit tests** — Individual functions/modules
2. **Integration tests** — Multi-module flows
3. **Schema validation** — Zod schema edge cases
4. **Determinism tests** — Output consistency

## Test Helpers

Use builders from `tests/helpers/`:

- `buildMessage()` — Test data builders
- `createValidCSVRow()` — CSV fixtures
- `assertValidMessage()` — Schema assertions
- `mockGeminiClient()` — AI provider mocks
- `mockFirecrawl()` — Link enrichment mocks

## File Organization

- Test files alongside source: `*.test.ts`
- Test helpers in `tests/helpers/`
- Fixtures in `__tests__/fixtures/`
- Integration tests in `__tests__/` at module level

## Running Tests

```bash
bun test                 # All tests
bun test --watch         # Watch mode
bun test --coverage      # With coverage
bun test src/enrich      # Specific directory
```

## Mock Creation

- **Naming:** `createMock{Provider}()` — factory returning `vi.fn()`
- **Composite:** `createMockProviderSuite()` + `setupMockFailures(suite, msg)`
- **Reset:** `resetAllMocks()` between tests

## Builder Pattern

```typescript
messageBuilder()
  .text('Hello')
  .fromMe()
  .media({ kind: 'image', path: '/photo.jpg' })
  .build()
```

## Deterministic Datasets

- Use `createTestMessage()` for snapshot tests (deterministic)
- Sizes: Small(10), Medium(100), Large(500), Huge(1000)
- **AVOID `createMessageFixture()`** for snapshots (uses random GUID)

## Snapshot Normalization

Always use `normalizeText()` for cross-OS stability (CRLF/CR → LF)
