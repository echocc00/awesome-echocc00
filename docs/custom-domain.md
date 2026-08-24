# Custom Domain Setup · www.echocco.com

This document describes how to configure the custom domain `www.echocco.com` for the GitHub Pages site at `https://echocc00.github.io/awesome-echocc00/`.

## Status

| Item | Status |
|---|---|
| Domain `www.echocco.com` purchased | ✅ |
| GitHub repo CNAME file | ✅ (commit `01e29abf`) |
| GitHub Pages cname configured | ✅ |
| DNS records configured at registrar | ⏸ **TODO — owner action required** |
| Let's Encrypt SSL certificate | ⏸ auto-issued after DNS propagates |
| HTTPS enforced | ⏸ enable after cert issued |

## DNS Configuration

Configure these records at your domain registrar's DNS management panel.

### Required: www.echocco.com → GitHub Pages

| Type | Name | Value | TTL |
|---|---|---|---|
| CNAME | `www` | `echocc00.github.io.` | 3600 (or default) |

**Notes**:
- The trailing dot (`.`) at the end of `echocc00.github.io.` is sometimes required by DNS spec, sometimes added automatically by the registrar's UI.
- If unsure, enter `echocc00.github.io` without dot — verify with `dig www.echocco.com +short` that the value shows as `echocc00.github.io.` (with dot).

### Recommended: apex echocco.com → GitHub Pages

If you also want `echocco.com` (without `www`) to point to your site:

| Type | Name | Value |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |

These are GitHub's 4 apex IPs. GitHub will automatically 301-redirect `echocco.com` → `www.echocco.com`.

**Skip this section** if you want apex `echocco.com` to stay pointing to a different service.

### Optional: CAA record (restrict CAs)

| Type | Name | Value |
|---|---|---|
| CAA | `@` | `0 issue "letsencrypt.org"` |

## Verification

After configuring DNS, wait 5-30 minutes for propagation, then run:

```bash
# Check CNAME
dig www.echocco.com +short
# Expected: a CNAME result pointing to echocc00.github.io.

# Check apex A records
dig echocco.com +short
# Expected: one of 185.199.108.153 / 109 / 110 / 111

# Check from public DNS (Google)
dig @8.8.8.8 www.echocco.com +short
```

If you see the expected results, GitHub Pages will detect the DNS within a few minutes and start provisioning the Let's Encrypt certificate.

## GitHub-side Configuration (already done)

1. **CNAME file** in repo root containing:
   ```
   www.echocco.com
   ```

2. **GitHub Pages Settings → Custom domain**: `www.echocco.com`

3. **HTTPS enforced**: will be enabled once cert is issued

## After DNS propagates (5-30 min)

GitHub Pages will:

1. Detect the CNAME → DNS match
2. Provision a Let's Encrypt SSL certificate (1-5 min)
3. Auto-redirect HTTP → HTTPS
4. Display "✅ Your site is live at https://www.echocco.com/"

## PWA Path Adaptation (TODO after DNS works)

Currently the PWA manifest has:
```json
{
  "start_url": "/awesome-echocc00/",
  "scope": "/awesome-echocc00/"
}
```

After the custom domain works, this needs to change to:
```json
{
  "start_url": "/",
  "scope": "/"
}
```

Because the root URL will now serve `index.html` directly (no more `/awesome-echocc00/` prefix).

**This will be done after DNS is verified working.**

## Reverting

To remove the custom domain:

```bash
# Delete CNAME file
git rm CNAME
git commit -m "chore: remove custom domain"
git push

# Clear "Custom domain" field in Settings → Pages
```

## Common Issues

| Symptom | Cause | Fix |
|---|---|---|
| "DNS check in progress" hangs | CNAME not pointed correctly | Verify `dig www.echocco.com +short` |
| HTTPS cert not issued | DNS not propagated yet | Wait 30 min, then check Pages tab |
| "Incorrect DNS" warning | A records missing/wrong for apex | Add all 4 GitHub IPs |
| 404 after configuring | PWA manifest path mismatch | Will be fixed post-DNS |

## Registrar-specific notes

### Cloudflare

- Free plan: DNS is automatic, just add records
- "Proxy" should be **DNS only** (grey cloud) for CNAME to echocc00.github.io, **NOT** orange cloud (proxied), since GitHub Pages needs direct CNAME

### 阿里云 (Aliyun)

- DNS console at https://dns.console.aliyun.com
- Add records → CNAME → www → echocc00.github.io

### 腾讯云

- DNSPod at https://console.dnspod.cn
- Add record → CNAME → www → echocc00.github.io

### GoDaddy

- DNS management in "My Products" → Domains → Manage DNS
- Add record → CNAME → www → echocc00.github.io

---

Last updated: 2026-08-23 · Configured by [@echocc00](https://github.com/echocc00)