# Custom Domain Setup Guide

This document describes how to configure a custom domain for the GitHub Pages site at `https://echocc00.github.io/awesome-echocc00/`.

## Prerequisites

- You own a domain (e.g., `yourname.dev`, `yourname.com`)
- You have DNS control over that domain

## DNS Configuration

Add these records at your DNS provider (Cloudflare, Route53, Aliyun DNS, GoDaddy, etc.):

### Option A: Subdomain (e.g., `www.yourname.dev`)

| Type | Name | Value |
|---|---|---|
| CNAME | `www` | `echocc00.github.io.` |

### Option B: Apex domain (e.g., `yourname.dev`)

For apex domains, CNAME doesn't work. Use A records pointing to GitHub's IPs:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

### Option C: Both apex + www

Set up both Option A and Option B above.

### Optional: CAA record (restricts which CAs can issue certs)

| Type | Name | Value |
|---|---|---|
| CAA | `@` | `0 issue "letsencrypt.org"` |

## GitHub Repository Configuration

### 1. Create CNAME file

In the `awesome-echocc00` repository root, create a file `CNAME` containing exactly your domain:

```
yourname.dev
```

**Note**: No `https://`, no trailing path. Just the bare domain.

### 2. Push the CNAME file

```bash
git add CNAME
git commit -m "chore: add custom domain"
git push
```

Or via GitHub Contents API:

```bash
gh api repos/echocc00/awesome-echocc00/contents/CNAME -X PUT \
  -f message="chore: add custom domain" \
  -f content="$(echo -n 'yourname.dev' | base64)"
```

### 3. Configure GitHub Pages

In GitHub Settings → Pages → Custom domain, enter:

```
yourname.dev
```

Check **Enforce HTTPS** (recommended).

## Verification

After DNS propagates (5 minutes to 48 hours):

```bash
# Check DNS resolution
dig yourname.dev +short
# Should return one of: 185.199.108.153 / 109.153 / 110.153 / 111.153

dig www.yourname.dev +short
# Should return CNAME → echocc00.github.io → one of the IPs above

# Check GitHub Pages status
gh api repos/echocc00/awesome-echocc00/pages --jq '{cname, https_enforced, status}'
```

## Troubleshooting

- **DNS not resolving**: Wait 24-48 hours for full propagation
- **HTTPS not enforced**: GitHub auto-provisions Let's Encrypt cert within minutes of correct DNS; check Settings → Pages for errors
- **Mixed content**: Make sure all `http://` references in your PWA / README are `https://`
- **CNAME conflict**: Only one domain per GitHub Pages site; remove old CNAMEs first

## Reverting

To remove custom domain:

```bash
# Delete CNAME file
git rm CNAME
git commit -m "chore: remove custom domain"
git push
```

Then clear the "Custom domain" field in Settings → Pages.

---

**Status**: Pending domain purchase. Update this file once `yourname.dev` (or chosen domain) is configured.