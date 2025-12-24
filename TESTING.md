# Release Workflow Testing Guide (ADHD-friendly)

> **Quick nav**: [Auto-Publish](#test-1-auto-publish-push-to-main) | [Pre-release Version](#test-2-pre-release-version-bump) | [Pre-release Publish](#test-3-pre-release-publish) | [Snapshot](#test-4-canary-snapshot) | [Pre-mode Toggle](#test-5-pre-mode-toggle) | [Verification](#verification-checklist)

Visual structure. Step-by-step. No surprises.

---

## Workflow Overview

**Single unified workflow**: `publish.yml`

| Intent | Trigger | What it does |
|--------|---------|--------------|
| `auto` | Push to main | Changesets action (opens Version PR or publishes stable) |
| `version` | Manual | Creates pre-release version bump PR |
| `publish` | Manual | Publishes pre-release to npm with channel tag |
| `snapshot` | Manual | Publishes canary snapshot (no pre-mode required) |

---

## Pre-Test Setup (2 minutes)

**Before testing any workflow:**

1. **Verify OIDC is configured**:
   - Go to: [npmjs.com/package/@nathanvale/chatline/access](https://www.npmjs.com/package/@nathanvale/chatline/access)
   - Settings → Trusted Publisher section
   - Should see: `nathanvale/chatline` with **`publish.yml`** workflow

2. **Check Node 24 is available in CI**:
   ```bash
   # Workflows use Node 24 for npm 11.6+ (OIDC support)
   # This is already configured in publish.yml
   ```

3. **Verify GitHub Actions permissions**:
   - Repo Settings → Actions → General
   - Workflow permissions: "Read and write permissions" ✅
   - "Allow GitHub Actions to create and approve pull requests" ✅

4. **Local environment check**:
   ```bash
   # Auth
   gh auth status
   npm whoami

   # Clean state
   git status --short --branch

   # Dependencies
   bun install --frozen-lockfile
   ```

**Safety notes**:
- All tests publish to npm (use canary tag for safety)
- Each test is independent (run one at a time)
- Keep `NPM_TOKEN` secret as fallback (OIDC primary)

---

## Test 1: Auto-Publish (Push to Main)

**What you're testing**: Automatic "Version Packages" PR creation + auto-publish on merge

**Duration**: ~10 minutes

**Safety**: Publishes to npm `latest` tag (use this for real releases only)

### Step 1: Create Test Changeset

```bash
# Create feature branch
git checkout -b test/auto-publish-workflow
git push -u origin test/auto-publish-workflow

# Add a changeset
bun version:gen

# Example changeset:
# - Package: @nathanvale/chatline
# - Type: patch
# - Summary: "test: verify auto-publish workflow"

# Commit and push
git add .changeset/
git commit -m "test: add changeset for auto-publish workflow"
git push
```

**✅ Verify**: Changeset file created in `.changeset/` directory

---

### Step 2: Create PR and Merge to Main

```bash
# Create PR via GitHub CLI
gh pr create \
  --title "test: auto-publish workflow" \
  --body "Testing publish workflow auto path. This PR will trigger the bot to create a 'Version Packages' PR."

# Wait for PR checks to pass
gh pr checks

# Merge to main
gh pr merge --squash --auto
```

**✅ Verify**:
- PR checks pass (quality-check, tests, etc.)
- PR merges successfully
- You're back on `main` branch

---

### Step 3: Wait for "Version Packages" PR

**What happens**: `publish.yml` workflow runs on main push with `intent=auto`

**Timeline**: ~2-3 minutes

**Where to watch**:
- Actions → "Publish"
- Pull Requests → Look for "Version Packages" PR from `chatline-changesets-bot`

**Expected PR contents**:
- Title: "chore: version packages"
- Changes:
  - `package.json` version bumped (e.g., `0.0.1` → `0.0.2`)
  - `.changeset/` files removed
  - `CHANGELOG.md` updated with new entry

**✅ Verify**:
- "Version Packages" PR created
- Version bump is correct (patch/minor/major)
- CHANGELOG.md has your changeset summary
- No workflow errors in Actions tab

---

### Step 4: Merge "Version Packages" PR

```bash
# Check out the Version Packages PR locally (optional)
gh pr checkout <PR-number>

# Review changes
git log -1 --stat

# Merge (or let auto-merge handle it)
gh pr merge <PR-number> --squash
```

**What happens on merge**: Workflow detects version commit and publishes to npm

**✅ Verify**:
- Workflow runs: Actions → "Publish"
- Workflow step "Changesets - open PR or publish" shows publish logs
- Check workflow logs for:
  ```
  🦋  info npm token bypassed
  🦋  Publishing packages to npm
  🦋  success packages published successfully
  ```

---

### Step 5: Verify npm Publish

```bash
# Check npm registry
npm view @nathanvale/chatline

# Expected output shows new version:
# @nathanvale/chatline@0.0.2 | MIT | deps: 8 | versions: 3

# Check dist-tags
npm view @nathanvale/chatline dist-tags

# Expected:
# latest: 0.0.2
```

**✅ Verify**:
- New version appears on npm
- `latest` tag points to new version
- Package page shows provenance badge (shield icon)

---

### Step 6: Verify Provenance

1. Go to: `https://www.npmjs.com/package/@nathanvale/chatline`
2. Click the version number
3. Look for "Provenance" section
4. Click "View more details"

**✅ Verify**:
- Provenance attestation exists
- Source: `github.com/nathanvale/chatline`
- Workflow: `publish.yml`
- Commit SHA matches your merge commit

---

### Cleanup

```bash
# Delete test branch
git branch -d test/auto-publish-workflow
git push origin --delete test/auto-publish-workflow
```

---

## Test 2: Pre-release Version Bump

**What you're testing**: Manual pre-release version bump via `intent=version`

**Duration**: ~5 minutes

**Safety**: Only creates a PR, doesn't publish

### Step 1: Enter Pre-Mode

```bash
# Use workflow or locally
gh workflow run pre-mode.yml -f action=enter -f channel=next

# Wait for workflow to complete
gh run list --workflow=pre-mode.yml --limit=1

# Pull changes
git pull

# ✅ Verify: .changeset/pre.json created
cat .changeset/pre.json
# Expected:
# {
#   "mode": "pre",
#   "tag": "next",
#   "initialVersions": { "@nathanvale/chatline": "0.0.2" },
#   "changesets": []
# }
```

**✅ Verify**: `.changeset/pre.json` exists and has `"tag": "next"`

---

### Step 2: Add Changeset for Prerelease

```bash
# Add changeset
bun version:gen

# Example:
# - Package: @nathanvale/chatline
# - Type: minor
# - Summary: "feat: test next channel prerelease"

# Commit and push
git add .changeset/
git commit -m "feat: add changeset for next channel"
git push
```

**✅ Verify**: Changeset file in `.changeset/` directory

---

### Step 3: Run Version Workflow

```bash
# Via CLI
gh workflow run publish.yml -f intent=version -f channel=next

# Or via GitHub Actions UI:
# 1. Go to: Actions → "Publish"
# 2. Click "Run workflow"
# 3. Intent: version
# 4. Channel: next
# 5. Run workflow
```

**What happens**: Workflow runs `bun run version:pre`, creates PR with auto-merge

**✅ Verify** (in workflow logs):
- Workflow completes successfully
- PR created: `chore(prerelease): version bump on next channel`
- Check version bump in PR:
  ```bash
  gh pr list --search="prerelease"
  ```

---

### Step 4: Merge Version PR

```bash
# PR should auto-merge after checks pass
# Or merge manually:
gh pr merge <PR-number> --squash

# Pull changes
git pull

# Check version
cat package.json | grep version
# Expected: "version": "0.1.0-next.0"
```

**✅ Verify**: Version bumped to prerelease format

---

## Test 3: Pre-release Publish

**What you're testing**: Manual pre-release publish via `intent=publish`

**Duration**: ~5 minutes

**Safety**: Publishes to channel tag (not `latest`)

### Prerequisites

- Must be in pre-mode (`.changeset/pre.json` exists)
- Version already bumped (from Test 2)

### Step 1: Run Publish Workflow

```bash
# Via CLI
gh workflow run publish.yml -f intent=publish -f channel=next

# Or via GitHub Actions UI:
# 1. Go to: Actions → "Publish"
# 2. Click "Run workflow"
# 3. Intent: publish
# 4. Channel: next
# 5. Run workflow
```

**What happens**: Publishes `0.1.0-next.0` with `--tag next`

**✅ Verify** (in workflow logs):
- Step "Publish prerelease" shows:
  ```
  🦋  Publishing packages to npm
  🦋  success packages published successfully
  ```

---

### Step 2: Verify npm Publish

```bash
# Check npm
npm view @nathanvale/chatline dist-tags

# Expected:
# latest: 0.0.2
# next: 0.1.0-next.0
```

**✅ Verify**: `next` tag points to prerelease version

---

### Step 3: Verify GitHub Prerelease

```bash
gh release list --limit=3

# Expected: v0.1.0-next.0 marked as Pre-release
```

**✅ Verify**: GitHub prerelease created

---

### Step 4: Test Installing from Channel

```bash
# Create temp directory
mkdir -p /tmp/test-next-install
cd /tmp/test-next-install

# Install from next channel
npm install @nathanvale/chatline@next

# ✅ Verify version
npm list @nathanvale/chatline
# Expected: @nathanvale/chatline@0.1.0-next.0

# Cleanup
cd -
rm -rf /tmp/test-next-install
```

---

### Step 5: Exit Pre-Mode

```bash
# Exit pre-mode
gh workflow run pre-mode.yml -f action=exit

# Wait and pull
gh run list --workflow=pre-mode.yml --limit=1
git pull

# ✅ Verify: .changeset/pre.json deleted
test -f .changeset/pre.json && echo "Still in pre-mode!" || echo "Pre-mode exited ✅"
```

---

## Test 4: Canary Snapshot

**What you're testing**: Quick snapshot publish via `intent=snapshot`

**Duration**: ~5 minutes

**Safety**: Uses `canary` tag, ephemeral version

### Step 1: Ensure Pre-Mode is FULLY OFF

> **Important**: Snapshot won't work if pre.json exists (even with `"mode": "exit"`).
> You must fully exit pre-mode by consuming changesets.

```bash
# Check pre-mode status
test -f .changeset/pre.json && echo "⚠️  In pre-mode, exit first!" || echo "✅ Not in pre-mode"

# If in pre-mode, fully exit (two-step process):
# Step 1: Set mode to exit
gh workflow run pre-mode.yml -f action=exit
# Wait for workflow, merge the PR

# Step 2: Consume changesets to delete pre.json
gh workflow run publish.yml -f intent=auto
# Wait for workflow, merge "Version Packages" PR if created

# Verify pre.json is deleted
git pull
test -f .changeset/pre.json && echo "⚠️  Still exists!" || echo "✅ Ready for snapshot"
```

---

### Step 2: Run Snapshot Workflow

```bash
# Via CLI
gh workflow run publish.yml -f intent=snapshot -f channel=next

# Or via GitHub Actions UI:
# 1. Go to: Actions → "Publish"
# 2. Click "Run workflow"
# 3. Intent: snapshot
# 4. Channel: (ignored for snapshot)
# 5. Run workflow
```

**What happens**:
- Creates snapshot version (e.g., `0.0.0-canary-20241203123456`)
- Publishes with `--tag canary`
- No git commit (ephemeral)

**✅ Verify** (in workflow logs):
- Step "Canary snapshot publish" shows:
  ```
  🦋  New tag: @nathanvale/chatline@0.0.0-canary-20241203123456
  🦋  Publishing packages to npm
  🦋  success packages published successfully
  ```

---

### Step 3: Verify Canary Tag on npm

```bash
npm view @nathanvale/chatline dist-tags

# Expected:
# latest: 0.0.2
# next: 0.1.0-next.0
# canary: 0.0.0-canary-20241203123456
```

**✅ Verify**: `canary` tag exists and points to snapshot version

---

### Step 4: Test Installing Canary

```bash
# Install canary version
mkdir -p /tmp/test-canary
cd /tmp/test-canary
npm install @nathanvale/chatline@canary

# ✅ Verify
npm list @nathanvale/chatline
# Expected: @nathanvale/chatline@0.0.0-canary-YYYYMMDDHHMMSS

# Cleanup
cd -
rm -rf /tmp/test-canary
```

---

## Test 5: Pre-Mode Toggle

**What you're testing**: Workflow to enter/exit prerelease mode

**Duration**: ~3 minutes

### Step 1: Enter Pre-Mode via Workflow

```bash
# Via CLI
gh workflow run pre-mode.yml -f action=enter -f channel=beta

# Or via GitHub Actions UI:
# 1. Go to: Actions → "Changesets Pre-Mode Toggle"
# 2. Click "Run workflow"
# 3. Action: enter
# 4. Channel: beta
# 5. Run workflow
```

**What happens**: Creates a PR to add `.changeset/pre.json` (requires merge)

> **Note**: The pre-mode workflow creates a PR instead of directly committing to main
> (branch protection). You'll need to merge the PR to activate pre-mode.

**✅ Verify**:
- Workflow completes
- PR created: `chore(pre): enter beta channel`
- Merge the PR:
  ```bash
  # PR may need pr-quality checks to pass first
  # If checks don't trigger, push empty commit:
  git fetch origin <branch> && git checkout <branch>
  git commit --allow-empty -m "chore: trigger checks"
  git push origin <branch>

  # Then merge
  gh pr merge <PR-number> --squash
  git checkout main && git pull
  cat .changeset/pre.json
  # Expected: {"mode": "pre", "tag": "beta", ...}
  ```

---

### Step 2: Exit Pre-Mode via Workflow

```bash
# Via CLI
gh workflow run pre-mode.yml -f action=exit

# Or via GitHub Actions UI:
# 1. Go to: Actions → "Changesets Pre-Mode Toggle"
# 2. Click "Run workflow"
# 3. Action: exit
# 4. Run workflow
```

**What happens**: Creates a PR that sets `"mode": "exit"` in pre.json

> **Important**: Exiting pre-mode is a two-step process:
> 1. The exit workflow sets `"mode": "exit"` (merge this PR)
> 2. Run `intent=auto` to consume changesets and fully delete pre.json

**✅ Verify**:
- Workflow completes
- PR created: `chore(pre): exit <channel> channel`
- Merge the PR (may need empty commit to trigger checks)
- After merge, pre.json has `"mode": "exit"`
- To fully exit (delete pre.json):
  ```bash
  # Run auto to consume changesets and delete pre.json
  gh workflow run publish.yml -f intent=auto

  # This creates "Version Packages" PR if changesets exist
  # Merge that PR to fully exit pre-mode

  # Verify
  git pull
  test -f .changeset/pre.json && echo "❌ Still exists" || echo "✅ Deleted"
  ```

---

## Test 6: Pre-mode Validation Failure

**What you're testing**: Workflow fails gracefully without pre-mode

**Duration**: ~2 minutes

### Step 1: Ensure NOT in Pre-Mode

```bash
test -f .changeset/pre.json && echo "Exit first!" || echo "✅ Ready"
```

### Step 2: Try Version (Should Fail)

```bash
gh workflow run publish.yml -f intent=version -f channel=next

# Wait for workflow
gh run list --workflow=publish.yml --limit=1
```

**✅ Verify**:
- Workflow fails at "Validate pre-mode state" step
- Error message: "Not in pre-release mode. Run 'Changesets Pre-Mode Toggle' workflow first."

```bash
gh run list --workflow=publish.yml --limit=1 --json conclusion
# Should show "failure"
```

---

## Verification Checklist

Use this after running tests to ensure everything works:

### OIDC Trusted Publishing
- [ ] No `NPM_TOKEN` warnings in workflow logs
- [ ] Workflow logs show: "No NPM_TOKEN; relying on OIDC trusted publishing"
- [ ] Publish succeeds without token
- [ ] Provenance badge appears on npm package page

### Changesets Integration
- [ ] `bunx changeset status` shows accurate pending changesets
- [ ] Version bumps follow semver (patch/minor/major)
- [ ] CHANGELOG.md updates correctly
- [ ] Changesets are removed after version bump

### GitHub Actions
- [ ] All workflows complete successfully
- [ ] Quality checks pass (biome, typecheck)
- [ ] Build step succeeds
- [ ] Publish step succeeds
- [ ] Git commits are created (for version workflows)
- [ ] No permission errors

### npm Registry
- [ ] New versions appear on npm
- [ ] Dist-tags are correct (`latest`, `next`, `beta`, `canary`)
- [ ] Provenance attestations exist
- [ ] Package installs successfully (`npm install`)
- [ ] Scoped package is public (not 404)

### Git State
- [ ] No uncommitted changes after workflows
- [ ] Tags are pushed to GitHub
- [ ] Branches are clean
- [ ] Pre-mode state matches expectations

---

## Troubleshooting

### PR checks not running (workflow-created branches)

**Cause**: PRs created by `workflow_dispatch` don't trigger `pull_request` workflows

**Fix**: Push an empty commit to trigger checks:
```bash
git fetch origin <branch>
git checkout <branch>
git commit --allow-empty -m "chore: trigger checks"
git push origin <branch>
```

---

### PR won't merge (branch protection)

**Cause**: "All checks passed" job hasn't run yet

**Fix**:
1. Check `gh pr checks <PR-number>` for missing checks
2. If pr-quality workflow hasn't run, push empty commit (see above)
3. Wait for "All checks passed" job to complete

---

### "npm ERR! code ENEEDAUTH"

**Cause**: OIDC not configured OR npm version too old

**Fix**:
1. Verify trusted publisher at npmjs.com points to `publish.yml`
2. Ensure workflow uses Node 24 (npm 11.6+)
3. Add `NPM_TOKEN` as fallback

---

### "Snapshot release is not allowed in pre mode"

**Cause**: Trying canary snapshot while in pre-mode (including `"mode": "exit"` state)

**Fix**:
```bash
# Exit pre-mode
gh workflow run pre-mode.yml -f action=exit
# Wait for workflow, merge PR

# Fully consume exit state (deletes pre.json)
gh workflow run publish.yml -f intent=auto
# Wait for workflow, merge "Version Packages" PR if created

# Verify pre.json is deleted
test -f .changeset/pre.json && echo "Still in pre-mode!" || echo "Ready for snapshot"

# Now retry snapshot
gh workflow run publish.yml -f intent=snapshot
```

---

### Version/publish succeeds in "mode: exit" state

**Not a bug**: The workflow treats `"mode": "exit"` as still valid for version operations.
This allows completing any in-flight pre-release work before fully exiting.

To fully exit pre-mode (delete pre.json):
```bash
gh workflow run publish.yml -f intent=auto
# Merge "Version Packages" PR if created
```

---

### "Not in pre-release mode" (version/publish intent)

**Cause**: Trying prerelease version/publish without pre-mode

**Fix**:
```bash
gh workflow run pre-mode.yml -f action=enter -f channel=next
# Wait for workflow, then retry
```

---

### Workflow succeeds but package not on npm

**Cause**: Publish step silently failed (check logs)

**Fix**:
1. Check workflow logs for actual error
2. Verify package name isn't taken
3. Verify you have publish permissions
4. Try manual publish locally:
   ```bash
   npm publish --dry-run
   ```

---

### GitHub release not created

**Cause**: Only `intent=publish` creates GitHub prereleases; `intent=auto` creates stable releases

**Fix**: Check which intent was used:
- `auto` → stable GitHub release on publish
- `publish` → prerelease GitHub release

---

## Test Results Template

Copy this template to track your test results:

```markdown
## Release Workflow Test Results

**Date**: YYYY-MM-DD
**Tester**: Your Name
**Workflow**: publish.yml

### Test 1: Auto-Publish (Push to Main)
- [ ] Changeset created
- [ ] PR merged to main
- [ ] "Version Packages" PR created
- [ ] Version Packages PR merged
- [ ] Package published to npm
- [ ] Provenance verified
- **Result**: ✅ Pass / ❌ Fail
- **Notes**:

### Test 2: Pre-release Version Bump
- [ ] Entered pre-mode
- [ ] Changeset added
- [ ] Version workflow ran (intent=version)
- [ ] Version PR created with auto-merge
- [ ] Version bumped to prerelease format
- **Result**: ✅ Pass / ❌ Fail
- **Notes**:

### Test 3: Pre-release Publish
- [ ] Publish workflow ran (intent=publish)
- [ ] Package on npm with channel tag
- [ ] GitHub prerelease created
- [ ] Installed from channel tag
- [ ] Exited pre-mode
- **Result**: ✅ Pass / ❌ Fail
- **Notes**:

### Test 4: Canary Snapshot
- [ ] Pre-mode exited
- [ ] Snapshot workflow ran (intent=snapshot)
- [ ] Canary tag on npm
- [ ] Installed from canary
- **Result**: ✅ Pass / ❌ Fail
- **Notes**:

### Test 5: Pre-Mode Toggle
- [ ] Entered via workflow
- [ ] Exited via workflow
- **Result**: ✅ Pass / ❌ Fail
- **Notes**:

### Test 6: Pre-mode Validation
- [ ] Version intent fails without pre-mode
- [ ] Error message is clear
- **Result**: ✅ Pass / ❌ Fail
- **Notes**:

### Overall Result
- **OIDC Working**: ✅ Yes / ❌ No
- **All Tests Pass**: ✅ Yes / ❌ No
- **Ready for Production**: ✅ Yes / ❌ No
```

---

## Rollback Plan

If the consolidated workflow has issues:

```bash
# Revert the commit
git revert HEAD
git push origin main

# Restore old workflows from git history
git checkout HEAD~1 -- .github/workflows/changesets-manage-publish.yml
git checkout HEAD~1 -- .github/workflows/channel-release.yml
git commit -m "revert: restore separate publish workflows"
git push origin main

# Update npm trusted publisher back to channel-release.yml
```

---

## Next Steps After Testing

1. **If all tests pass**:
   - Document any edge cases discovered
   - Update RELEASES.md with lessons learned
   - Consider enabling auto-publish for all stable releases

2. **If tests fail**:
   - Check workflow logs for specific errors
   - Verify OIDC configuration points to `publish.yml`
   - Test with `NPM_TOKEN` fallback
   - Open GitHub issue with logs

3. **Ongoing maintenance**:
   - Test workflows quarterly
   - Update when Changesets or npm changes
   - Monitor npm deprecation notices
   - Keep Node version current (24+)
