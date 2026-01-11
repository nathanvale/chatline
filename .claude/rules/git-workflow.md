# Git Workflow Rules

## Branch Pattern

`type/description` — Examples: `feat/pdf-support`, `fix/date-parsing`

## Commit Format

Conventional Commits (enforced by commitlint):

```
type(scope): subject

feat(enrich): add PDF summarization support
fix(cli): handle missing API key gracefully
chore(deps): upgrade Biome to 2.3.7
```

**Types:** `feat`, `fix`, `chore`, `docs`, `ci`, `test`, `refactor`, `perf`

## Protected Branch

`main` is protected:

- Requires PR + approval
- Requires passing CI checks
- Linear history (squash merge)
- No direct pushes (pre-push hook blocks)

## Before Pushing

**ALWAYS run `bun run validate`** before pushing:

```bash
bun run validate  # lint + types + build + test
```

## Changesets

**ALWAYS create changesets** for user-facing changes:

```bash
bun version:gen  # Interactive changeset creation
```

## NEVER

- **NEVER push directly to main** — Pre-push hook blocks this
- **NEVER use destructive commands** — No `reset --hard`, `push --force`
- **NEVER commit without changesets** — User-facing changes require them
