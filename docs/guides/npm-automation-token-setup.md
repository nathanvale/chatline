# NPM Authentication Setup Guide

> **⚠️ IMPORTANT:** This project uses **OIDC Trusted Publishing** as the primary authentication method. NPM tokens are fallback/bootstrap only.
>
> **For OIDC setup (recommended):** See [RELEASES.md - npm Trusted Publishing (OIDC) Setup](/Users/nathanvale/code/imessage-timeline/RELEASES.md#npm-trusted-publishing-oidc-setup)
>
> **This document:** Token setup for bootstrap scenarios or fallback authentication.

---

## Why OIDC Trusted Publishing? (Primary Method)

**OIDC eliminates security risks of long-lived tokens:**
- ✅ No secrets to leak, rotate, or manage
- ✅ Cryptographically-signed temporary credentials
- ✅ No 403 errors from expired tokens
- ✅ GitHub Actions proves identity to npm directly

**See [RELEASES.md lines 59-131](/Users/nathanvale/code/imessage-timeline/RELEASES.md#npm-trusted-publishing-oidc-setup) for full OIDC setup.**

---

## When Do You Need NPM Tokens?

**Bootstrap scenario:** Package doesn't exist on npm yet
- First publish must use token (OIDC requires existing package)
- After first publish, configure OIDC and remove token

**Fallback scenario:** OIDC configuration issues
- Workflows auto-detect OIDC; fall back to NPM_TOKEN if needed
- Check logs: `"No NPM_TOKEN; relying on OIDC trusted publishing."` vs `"NPM_TOKEN detected; using token auth (fallback mode)."`

---

## Automation Token Setup (Fallback/Bootstrap Only)

### Why Automation Tokens Over Classic Tokens?

Regular tokens can publish ALL your packages. Automation tokens can be
restricted to specific packages.

**Security:** If token leaks, damage is limited to this package only.

---

## Step-by-Step Token Setup

> **Reminder:** Only use tokens for bootstrap or fallback. Configure OIDC afterward.

### 1. Go to NPM Token Page

Visit: https://www.npmjs.com/settings/YOUR_USERNAME/tokens

(Replace YOUR_USERNAME with your npm username)

### 2. Click "Generate New Token"

Button is in the top right.

### 3. Select Token Type

Choose: **Automation**

(Not "Publish" - automation tokens have better security)

### 4. Configure Token Permissions

**Package permissions:**

- Select: "Read and write"
- Package: `chatline`

**IP Allowlist:** Leave empty (GitHub Actions IPs rotate)

**Expiration:**

- Recommended: 90 days
- Set a calendar reminder to rotate

### 5. Copy the Token

**IMPORTANT:** You only see this ONCE!

Format: `npm_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 6. Add to GitHub Secrets

1. Go to:
   `https://github.com/nathanvale/chatline/settings/secrets/actions`
2. Click "New repository secret"
3. Name: `NPM_TOKEN`
4. Value: Paste the token
5. Click "Add secret"

### 7. Verify Token Works (Bootstrap Only)

For bootstrap publish, the token is used in:

- `.github/workflows/publish.yml` (consolidated workflow)

**After bootstrap:** Configure OIDC (see [RELEASES.md](/Users/nathanvale/code/imessage-timeline/RELEASES.md#npm-trusted-publishing-oidc-setup)), then optionally delete NPM_TOKEN secret.

Workflows auto-detect OIDC and use it before falling back to tokens.

---

## Security Best Practices

### For OIDC (Primary Method)

✅ **DO:**
- Use OIDC trusted publishing (eliminates token risks entirely)
- Configure trusted publisher with exact workflow filename
- Verify OIDC is working via workflow logs
- Delete NPM_TOKEN secret after OIDC is verified

### For Tokens (Fallback/Bootstrap Only)

✅ **DO:**

- Use automation tokens (not classic tokens)
- Set expiration dates
- Rotate tokens every 90 days
- Restrict to specific packages
- Store in GitHub Secrets only
- **Migrate to OIDC as soon as package exists on npm**

❌ **DON'T:**

- Use classic "Publish" tokens
- Share tokens in chat/email
- Commit tokens to git
- Use tokens without expiration
- Give tokens access to all packages
- **Keep tokens when OIDC is available**

---

## Troubleshooting

### OIDC Errors (Primary Method)

See [RELEASES.md - Troubleshooting OIDC](/Users/nathanvale/code/imessage-timeline/RELEASES.md#troubleshooting-oidc) for:
- `ENEEDAUTH` - OIDC not configured
- `E403 Forbidden` - Workflow filename mismatch
- `E404 Not Found` - Package doesn't exist yet

### Token Errors (Fallback Only)

#### "403 Forbidden" Error

**Problem:** Token doesn't have permission to publish package

**Solution:**

1. Check token has "Read and write" permission
2. Verify package name is `chatline`
3. Make sure you're an owner/maintainer of the package
4. **Or:** Migrate to OIDC (eliminates permission issues)

#### "401 Unauthorized" Error

**Problem:** Token is invalid or expired

**Solution:**

1. Generate a new token following steps above
2. Update GitHub secret `NPM_TOKEN`
3. Re-run the workflow
4. **Or:** Migrate to OIDC (no expiration issues)

#### Token Expired

**Problem:** Got email "Your npm token is expiring soon"

**Solution:**

1. Generate a new token (same steps)
2. Update GitHub secret `NPM_TOKEN`
3. Old token is automatically revoked
4. **Better:** Migrate to OIDC (no rotation needed)

---

## Rotation Schedule (Token Fallback Only)

> **Note:** OIDC eliminates the need for token rotation. Only follow this if using token fallback.

**Recommended:** Rotate tokens every 90 days

1. Set calendar reminder for rotation date
2. Generate new token
3. Update GitHub secret
4. Old token automatically expires
5. Reset calendar reminder for 90 days later

**Better approach:** Migrate to OIDC (no rotation needed)

---

## Related Documentation

**Primary Authentication:**
- [RELEASES.md - npm Trusted Publishing (OIDC) Setup](/Users/nathanvale/code/imessage-timeline/RELEASES.md#npm-trusted-publishing-oidc-setup) - **Recommended**
- [npm Provenance Guide](https://docs.npmjs.com/generating-provenance-statements) - Official OIDC docs

**Token Fallback (Bootstrap Only):**
- [NPM Automation Tokens Docs](https://docs.npmjs.com/creating-and-viewing-access-tokens)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

**Release Process:**
- `docs/guides/automated-release-workflow.md` - How publishing workflows handle auth
