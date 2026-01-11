# Documentation

Quick links to key docs:

| Topic | Document |
|-------|----------|
| **Release Playbook** | [RELEASES.md](../RELEASES.md) - ADHD-friendly quick start |
| **CI/CD** | [CI.md](../CI.md) - Comprehensive workflow guide |
| **Testing** | [TESTING.md](../TESTING.md) - Testing strategy |

---

## Architecture

Technical specifications and system design.

| Document | Description |
|----------|-------------|
| [security-supply-chain.md](architecture/security-supply-chain.md) | Supply chain security |
| [logging.md](architecture/logging.md) | Logging architecture |

---

## Guides

How-to guides and best practices.

### Release & Publishing

| Document | Description |
|----------|-------------|
| [automated-release-workflow.md](guides/automated-release-workflow.md) | Comprehensive release reference |
| [pre-release-guide.md](guides/pre-release-guide.md) | Canary, beta, RC releases |
| [release-channels.md](guides/release-channels.md) | npm dist-tag channels |
| [changesets-canonical.md](guides/changesets-canonical.md) | Changesets workflow |
| [npm-automation-token-setup.md](guides/npm-automation-token-setup.md) | NPM auth (OIDC + fallback) |

### CI/CD & Workflows

| Document | Description |
|----------|-------------|
| [ci-workflow-standards.md](guides/ci-workflow-standards.md) | Workflow conventions |
| [actionlint-quickstart.md](guides/actionlint-quickstart.md) | Workflow linting setup |
| [actionlint-best-practices.md](guides/actionlint-best-practices.md) | Actionlint patterns |
| [GITHUB_APP_SETUP_TEMPLATE.md](guides/GITHUB_APP_SETUP_TEMPLATE.md) | GitHub App setup template |
| [emergency-rollback-procedure.md](guides/emergency-rollback-procedure.md) | Rollback procedures |

### Development

| Document | Description |
|----------|-------------|
| [testing-best-practices.md](guides/testing-best-practices.md) | Vitest patterns |
| [bun-script-best-practices.md](guides/bun-script-best-practices.md) | Bun CLI rationale |
| [bun-single-repo-best-practices.md](guides/bun-single-repo-best-practices.md) | Single-repo patterns |
| [vitest-firecrawl-esm-bun-best-practices.md](guides/vitest-firecrawl-esm-bun-best-practices.md) | ESM testing |

### Maintenance

| Document | Description |
|----------|-------------|
| [dependency-maintenance.md](guides/dependency-maintenance.md) | Dependency updates |
| [package-hygiene.md](guides/package-hygiene.md) | Package.json hygiene |
| [sbom-generation-review.md](guides/sbom-generation-review.md) | SBOM generation |

---

**Last Updated:** 2026-01-09
