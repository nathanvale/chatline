# Pre-Mode Workflow Consolidation Plan

> **Status:** ✅ **COMPLETED** - This document describes the consolidation work that has been completed. The workflows have been renamed: `channel-release.yml` is now `publish.yml`.

## 🎯 Goal

Have ONE clear way to manage pre-release mode (beta, rc, next channels).

## 📊 Current State (Confusing)

### Workflow 1: pre-mode.yml ✅ GOOD

- **Purpose:** Enter or exit pre-mode
- **How it works:** Creates a PR, waits for review, then merges
- **File:** `.github/workflows/pre-mode.yml`
- **Script:** `.github/scripts/pre-mode-toggle.sh`
- **Pros:**
  - Safe (follows branch protection)
  - Creates reviewable PRs
  - Uses standard git workflow
- **Cons:** None

### Workflow 2: channel-release.yml ⚠️ DOES TOO MUCH

- **Purpose:** Enter/exit pre-mode + version + publish
- **How it works:** Direct push to main (BAD)
- **File:** `.github/workflows/channel-release.yml`
- **Pros:**
  - All-in-one convenience
- **Cons:**
  - Bypasses branch protection (lines 57, 64, 79 do `git push`)
  - Bypasses PR review for enter/exit
  - Confusing overlap with pre-mode.yml
  - Inconsistent with documented PR-based workflow

## 🔍 Analysis Details

### What pre-mode.yml Does:

1. Creates branch: `pre/{action}-{channel}-{run_id}`
2. Runs: `pnpm changeset pre enter {channel}` OR `pnpm changeset pre exit`
3. Commits changes to branch
4. Opens PR with label `release:pre-toggle`
5. Waits for PR approval and merge

### What channel-release.yml Does (enter/exit):

1. Runs on main branch directly
2. For "enter": Runs `pnpm pre:enter:{channel}`, versions, commits, pushes to
   main
3. For "exit": Runs `pnpm pre:exit`, versions, commits, pushes to main
4. **Problem:** No PR, no review, bypasses protection

### What channel-release.yml Does (version/publish/snapshot):

1. For "version": Bumps versions, commits, pushes
2. For "publish": Publishes to npm with prerelease tag
3. For "snapshot": Publishes canary snapshot
4. **These are fine** - they should happen AFTER pre-mode is active

## ✅ Recommended Solution

### Keep: pre-mode.yml (for enter/exit only)

- Use this to enter or exit pre-release mode
- Creates a PR for review
- Safe and follows best practices
- Consistent with branch protection policy

### Modify: channel-release.yml (remove enter/exit)

- **Remove:** "enter" and "exit" intents (lines 50-57, 72-79)
- **Keep:** "version", "publish", "snapshot" intents
- These operations should happen AFTER pre-mode is active via PR

### New Workflow Becomes:

```
Want to start beta testing?
  ↓
1. Run pre-mode.yml with "enter" + "beta"
  ↓
2. Review and merge the PR
  ↓
3. Make changes, merge PRs with changesets
  ↓
4. Run channel-release.yml with "version" (updates versions)
  ↓
5. Run channel-release.yml with "publish" (publishes to npm@beta)
  ↓
6. Repeat steps 3-5 as needed
  ↓
7. Ready for stable? Run pre-mode.yml with "exit"
  ↓
8. Merge PR, then normal release workflow takes over
```

## 📋 Implementation Steps

1. ✅ Document the plan (this file)
2. ⏳ Remove "enter" and "exit" from channel-release.yml inputs
3. ⏳ Remove enter/exit steps from channel-release.yml (lines 50-57, 72-79)
4. ⏳ Update channel-release.yml description to clarify scope
5. ⏳ Create simple visual flowchart
6. ⏳ Update docs/release-channels.md with new workflow
7. ⏳ Update docs/releases/changesets-canonical.md quickstart section
8. ⏳ Add troubleshooting section

## 🔍 Files to Modify

### 1. `.github/workflows/channel-release.yml`

**Remove:**

- Input option "enter" from intent choices (line 12)
- Input option "exit" from intent choices (line 12)
- Step "Enter prerelease mode" (lines 50-57)
- Step "Exit prerelease mode" (lines 72-79)

**Update:**

- Description to: "Version and publish pre-release packages. Use pre-mode.yml to
  enter/exit pre-mode first."
- Intent description to: "Action: version | publish | snapshot"

### 2. `docs/release-channels.md`

**Update sections:**

- Workflow Overview: Clarify that channel-release.yml is for
  version/publish/snapshot only
- Typical Sequence: Reference pre-mode.yml for enter/exit steps
- Add clear section: "Which Workflow Do I Use?"

### 3. `docs/releases/changesets-canonical.md`

**Update:**

- Quickstart section to reference pre-mode.yml for enter/exit
- Remove any references to channel-release.yml for enter/exit
- Update "What the automation does" section

### 4. `docs/diagrams/pre-mode-workflow-simple.md` (NEW)

**Create:** Visual flowchart showing workflow progression

## ⚠️ Breaking Changes

**None.** The old workflow commands will simply not be available anymore.

**Migration path:**

- Old way: Run channel-release.yml with intent=enter
- New way: Run pre-mode.yml with action=enter
- Impact: Users see clear error (invalid intent option)
- Communication: Update docs before removing options

## 🧪 Testing Plan

After implementation, test this sequence:

1. ✅ Run pre-mode.yml with action=enter, channel=beta
   - Verify PR is created
   - Verify PR has correct changesets pre-mode changes
2. ✅ Merge the PR
   - Verify main branch is in pre-mode
3. ✅ Run channel-release.yml with intent=version
   - Verify versions are bumped correctly
4. ✅ Run channel-release.yml with intent=publish
   - Verify packages publish to beta tag
5. ✅ Run channel-release.yml with intent=snapshot
   - Verify canary snapshot publishes
6. ✅ Run pre-mode.yml with action=exit
   - Verify PR is created
   - Verify PR exits pre-mode correctly
7. ✅ Merge exit PR
   - Verify main branch is out of pre-mode
8. ❌ Try channel-release.yml with intent=enter
   - Verify clear error message (option not available)

## 📚 Documentation Updates Needed

- [ ] Update all references to "use channel-release for enter/exit"
- [ ] Create simple flowchart diagram
- [ ] Add "Which workflow should I use?" decision tree
- [ ] Update troubleshooting section
- [ ] Add common mistakes section
- [ ] Update workflow dispatch descriptions

## 🎓 Why This Matters (ADHD Context)

**Problem:** Two ways to do the same thing = confusion and mistakes

**Solution:** One workflow for enter/exit (safe), another for version/publish
(operational)

**Benefit:**

- Clear mental model: "pre-mode.yml = mode changes, channel-release.yml =
  package operations"
- Consistent with branch protection
- Easier to remember
- Fewer decisions to make

## 🚀 Next Steps

1. Review this plan
2. Get approval to proceed
3. Implement workflow changes
4. Update documentation
5. Test the new workflow
6. Communicate changes to users

## 📝 Notes

- Keep pre-mode-toggle.sh as-is (already works correctly)
- No changes needed to package.json scripts
- No changes needed to other workflows
- This is a simplification, not a feature addition

---

**Created:** 2025-11-14 **Status:** Proposed **Author:** Consolidation analysis
