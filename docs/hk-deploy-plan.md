# echocco.com 香港云主机部署完整方案

## 📋 目标

- ✅ `https://www.echocco.com/` 立即可用 HTTPS
- ✅ 走你香港云主机(国内访问快)
- ✅ 反代 GitHub Pages(你只更新 GitHub 仓库就行)
- ✅ 证书 90 天自动续期(acme.sh)
- ✅ 完全免费

---

## 🏗️ 架构

```
[ 用户 ] ↓
https://www.echocco.com ↓
[ 阿里云 DNS ] → 你的香港云主机公网 IP ↓
[ Nginx 443 ] → HTTPS 终止(acme.sh LE 证书) ↓
[ 反代 ] → https://echocc00.github.io/awesome-echocc00/(回源) ↓
[ 返回用户 ]
```

**保留 GitHub Pages** 作内容源,你只更新 GitHub。

---

## 📦 前置条件

- [x] 域名 `www.echocco.com`(已买,阿里云)
- [x] 香港云主机(ubuntu/debian,root 或 sudo 权限)
- [x] 主机 80 和 443 端口空闲
- [x] 主机有公网 IP(你能 SSH 进去)
- [x] GitHub Pages cname 已设(`www.echocco.com`)

---

## 🚀 执行步骤

### 步骤 0:SSH 进主机(你自己)

```bash
ssh root@你的香港主机IP
# 或:ssh user@你的香港主机IP  (再 sudo -i)
```

确认你在主机 shell 里(提示符应该是 `root@hostname` 类似)。

---

### 步骤 1: 跑诊断命令(贴输出给我)

```bash
cat /etc/os-release | head -3
echo "---"
sudo -n true 2>&1; echo "sudo exit: $?"
echo "---"
ss -tlnp | grep -E ':(80|443)\s' || echo "ports free"
echo "---"
curl -s ifconfig.me; echo
echo "---"
which nginx apache2 httpd 2>&1 | head -5
echo "---"
df -h / | tail -1
```

**把全部输出贴给我,我会根据实际环境微调脚本。**

---

### 步骤 2: 下载部署脚本(主机上执行)

```bash
# 下载两个脚本
mkdir -p /opt/echocco-deploy
cd /opt/echocco-deploy

curl -fsSL -o deploy.sh "https://gist.githubusercontent.com/echocc00/raw/deploy.sh"
curl -fsSL -o rollback.sh "https://gist.githubusercontent.com/echocc00/raw/rollback.sh"

chmod +x deploy.sh rollback.sh

# ⚠️ 如果上面的 URL 拉不到(因为我还没传到 gist),用我给你的本地文件:
# 1. 我把脚本内容贴给你
# 2. 你复制到主机: vim deploy.sh (粘贴内容)  :wq
# 3. chmod +x deploy.sh
```

---

### 步骤 3: 检查脚本内容(防止恶意脚本)

```bash
cat deploy.sh | head -50
cat rollback.sh
```

**确认无误后再运行。**

---

### 步骤 4: 跑部署脚本(主机上)

```bash
sudo bash deploy.sh
```

**脚本会自动做做这些事(每一步都有日志输出)**:

1. 检测环境(OS / 端口 / nginx 是否安装)
2. 安装 nginx(如果未安装)
3. 安装 acme.sh
4. 申请 Let's Encrypt 证书(`echocco.com` + `www.echocco.com`)
5. 安装证书到 `/etc/nginx/ssl/`
6. 写 nginx 配置到 `/etc/nginx/sites-available/echocco_com`
7. 测试 nginx 配置
8. 启动 nginx
9. 验证 HTTPS 工作

**耗时**: 2-5 分钟。

---

### 步骤 5: 检查结果(主机上)

```bash
# 证书信息
echo | openssl s_client -connect www.echocco.com:443 -servername www.echocco.com 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates

# 预期输出:
# subject= /CN=echocc.com
# issuer= /O=Let's Encrypt/CN=R11
# notBefore=...
# notAfter=... (90 天后过期,但会自动续期)

# HTTPS 测试
curl -sIk https://www.echocco.com/ | head -5

# 预期:
# HTTP/2 200
# server: GitHub.com
# content-length: 41274
```

---

### 步骤 6: 改阿里云 DNS(关键!)

去阿里云控制台:`https://dns.console.aliyun.com`

#### 6.1 找到 `www.echocco.com` 当前的 CNAME 记录

1. 域名 `echocco.com` → **解析设置**
2. 找 `www.echocco.com` 这条记录
3. 当前是 **CNAME** → `echocc00.github.io.`

#### 6.2 改成 A 记录 → 香港主机 IP

1. **删除** `www` 的 CNAME 记录
2. **添加** `www` 的 A 记录:
 - 记录类型: **A**
 - 主机记录: `www`
 - 记录值: **你的香港云主机公网 IP**(步骤 1 拿到的)
 - TTL: **600**(10 分钟,临时调短)
3. 同样修改 apex 域:
 - 找 `echocco.com` 这条记录
 - 如果是 A 记录 → 改成 **香港主机公网 IP**
 - 如果是别的 → 改成 A → 香港主机公网 IP
 - TTL: **600**

#### 6.4 DNS 传播(等 5-30 分钟)

```bash
# 等几分钟后跑:
nslookup www.echocco.com
# 应该应该: 你的香港主机 IP

# GitHub Pages 的 cert 验证看这里(国外 DNS):
nslookup www.echocco.com 8.8.8.8
# 也应该应该: 你的香港主机 IP
```

---

### 步骤 7 (可选,但推荐): 撤掉 GitHub Pages cname

**理由**:你香港主机现在 serve 你的网站,GitHub Pages cname 没用,留着混淆。

让我帮你撤(在 GitHub 端操作):

```
你回我:"DNS 改好了",我就撤 GitHub Pages cname
```

或者你手动撤:
1. 打开 https://github.com/echocc00/awesome-echocc00/settings/pages
2. 删掉 "Custom domain" 输入框内容
3. 点 Save

---

### 步骤 8: 验证最终效果

```bash
# 从你本地(Windows)浏览器打开:
https://www.echocco.com/

# 应该看到:
# ✅ 绿色锁 + PWA 内容
# ✅ Service Worker 可用(浏览器开发者工具 → Application → Service Workers)
# ✅ "添加到主屏幕" 可用
```

---

## 🔧 故障排查

### 问题 1: acme.sh 申请证书失败

**症状**: `deploy.sh` 报错 "证书申请失败"

**排查**:
```bash
# 1. 检查 80 端口是否真的空闲
sudo ss -tlnp | grep :80
# 应该是空的,或只有 nginx(脚本会先停 nginx)

# 2. 检查域名是否正确解析到主机
curl -s ifconfig.me
nslookup www.echocco.com
# 两者应该一致

# 3. 检查防火墙是否放行 80 / 443
sudo iptables -L -n
# 或 ufw: sudo ufw status
# 如果有防火墙:
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

### 问题 2: nginx 启动失败

**症状**: `nginx -t` 报错

**排查**:
```bash
sudo nginx -t
# 看具体错误

sudo cat /var/log/nginx/error.log | tail -20
```

### 问题 3: HTTPS 握手成功但内容不对

**症状**: 浏览器看到 GitHub 错误页面

**排查**:
```bash
# 检查反代是否工作
sudo curl -sIk http://127.0.0.1/ | head -3
# 应该是 GitHub Pages 的内容,不是错误

# 检查 nginx 配置
sudo nginx -T | grep proxy_pass
```

### 问题 4: 域名访问不到主机

**症状**: 浏览器说 "无法连接" 或 "超时"

**排查**:
```bash
# 1. DNS 解析
nslookup www.echocco.com
# 应该是主机 IP

# 2. 防火墙
sudo iptables -L -n | grep -E '80|443'
# 应该看到 ACCEPT(或防火墙没启用)

# 3. 公网 IP
curl -s ifconfig.me
# 应该是主机 IP
```

---

## 🔄 日常维护

### 自动续期(90 天一次)

**acme.sh 自动续期**,无需你操作。检查:
```bash
# 看 systemd cron 是否启用
sudo systemctl list-timers | grep acme

# 手动触发续期(测试用)
"$HOME/.acme.sh/acme.sh" --renew -d echocco.com --force
sudo systemctl reload nginx
```

### 重新部署网站内容

**你不需要重新跑 deploy.sh** —— 你**只更新 GitHub 仓库**,主机自动 fetch:

```bash
# 香港主机上(可选) — 写一个 webhook 自动部署
# 或者手动 pull(主机跑个小服务)
```

**实际你不需要操作**,因为 **nginx 反代会自动从 GitHub Pages 拉新内容**(GitHub Pages 你 push 后立刻生效)。

### 查看日志

```bash
# Nginx access log
sudo tail -f /var/log/nginx/echocco.com.access.log

# Nginx error log
sudo tail -f /var/log/nginx/echocco.com.error.log

# acme.sh 续期日志
ls ~/.acme.sh/echocco.com_ecc/
```

---

## 📜 脚本内容(备用)

如果 curl 下载脚本失败(网络问题),我直接给你**完整脚本内容**:

### deploy.sh

```bash
#!/bin/bash
# echocco.com 部署一键脚本
set -euo pipefail

DOMAIN="echocco.com"
WILDCARD_DOMAIN="*.${DOMAIN}"
GITHUB_PAGES_SOURCE="echocc00.github.io"
REPO_PATH="/awesome-echocc00"
NGINX_SITE_NAME="${DOMAIN//./_}"
NGINX_CONF="/etc/nginx/sites-available/${NGINX_SITE_NAME}"
WEBROOT="/var/www/${DOMAIN}"

RED='\033[0;31m'; GREEN='\033[0;32m'; YELLOW='\033[1:33m'; NC='\033[0m'
log() { echo -e "${GREEN}[$(date +'%H:%M:%S')]${NC} $*"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $*"; }
err() { echo -e "${RED}[ERROR]${NC} $*"; exit 1; }

[ "$(id -u)" -ne 0 ] && err "请以 root 运行: sudo bash $0"

. /etc/os-release 2>/dev/null || err "无法识别 OS"
log "OS: $PRETTY_NAME"

# 安装 nginx
if ! command -v nginx >/dev/null 2>&1; then
  if command -v apt-get >/dev/null 2>&1; then
    apt-get update -qq && apt-get install -y nginx
  elif command -v yum >/dev/null 2>&1; then
    yum install -y nginx
  else
    err "无法识别包管理器"
  fi
fi

# 安装 acme.sh
if [ ! -d "$HOME/.acme.sh" ]; then
  curl -fsSL https://get.acme.sh | sh -s email="admin@${DOMAIN}"
fi

# 申请证书(先停 nginx)
systemctl stop nginx 2>/dev/null || true

"$HOME/.acme.sh/acme.sh" --issue -d "${DOMAIN}" -d "www.${DOMAIN}" \
  --standalone --keylength ec-256 \
  --reloadcmd "systemctl reload nginx"

CERT_DIR="$HOME/.acme.sh/${DOMAIN}_ecc"
[ ! -f "${CERT_DIR}/fullchain.cer" ] && err "证书申请失败"

# 安装证书
mkdir -p /etc/nginx/ssl
"$HOME/.acme.sh/acme.sh" --install-cert -d "${DOMAIN}" --ecc \
  --key-file /etc/nginx/ssl/${DOMAIN}.key \
  --fullchain-file /etc/nginx/ssl/${DOMAIN}.crt \
  --reloadcmd "systemctl reload nginx"

# 写 nginx 配置
mkdir -p "${WEBROOT}"

cat > "${NGINX_CONF}" <<EOF
server {
    listen 80;
    listen [::]:80;
    server_name ${DOMAIN} www.${DOMAIN};
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    location / {
        return 301 https://www.${DOMAIN}\$request_uri;
    }
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name www.${DOMAIN};

    ssl_certificate     /etc/nginx/ssl/${DOMAIN}.crt;
    ssl_certificate_key /etc/nginx/ssl/${DOMAIN}.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;

    location / {
        proxy_pass https://${GITHUB_PAGES_SOURCE}${REPO_PATH};
        proxy_ssl_server_name ${GITHUB_PAGES_SOURCE};
        proxy_set_header Host ${GITHUB_PAGES_SOURCE};
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_redirect off;
    }

    location ~* \.(html|css|js|svg|webmanifest|json|woff2?)\$ {
        proxy_pass https://${GITHUB_PAGES_SOURCE}${REPO_PATH};
        proxy_ssl_server_name ${GITHUB_PAGES_SOURCE};
        proxy_set_header Host ${GITHUB_PAGES_SOURCE};
        proxy_cache_valid 200 1h;
        expires 1h;
        add_header Cache-Control "public, max-age=3600";
    }

    access_log /var/log/nginx/${DOMAIN}.access.log;
    error_log  /var/log/nginx/${DOMAIN}.error.log;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name ${DOMAIN};
    ssl_certificate     /etc/nginx/ssl/${DOMAIN}.crt;
    ssl_certificate_key /etc/nginx/ssl/${DOMAIN}.key;
    return 301 https://www.${DOMAIN}\$request_uri;
}
EOF

ln -sf "${NGINX_CONF}" "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}"
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl start nginx
systemctl enable nginx

sleep 2
echo | openssl s_client -connect www.${DOMAIN}:443 -servername www.${DOMAIN} 2>/dev/null \
  | openssl x509 -noout -subject -issuer -dates

log "✓ 部署完成"
log "HTTPS: https://www.${DOMAIN}/"
```

### rollback.sh

```bash
#!/bin/bash
# 回滚脚本
set -euo pipefail
DOMAIN="echocco.com"
NGINX_SITE_NAME="${DOMAIN//./_}"
NGINX_CONF="/etc/nginx/sites-available/${NGINX_SITE_NAME}"

[ "$(id -u)" -ne 0 ] && { echo "sudo bash $0"; exit 1; }

systemctl stop nginx 2>/dev/null || true
rm -f "/etc/nginx/sites-enabled/${NGINX_SITE_NAME}" "${NGINX_CONF}"

if [ -f "$HOME/.acme.sh/acme.sh" ]; then
  "$HOME/.acme.sh/acme.sh" --uninstall --nocron 2>/dev/null || true
fi
rm -rf /etc/nginx/ssl/${DOMAIN}.key /etc/nginx/ssl/${DOMAIN}.crt
rm -rf "$HOME/.acme.sh/${DOMAIN}" "$HOME/.acme.sh/${DOMAIN}_ecc"
rm -rf /var/www/${DOMAIN} 2>/dev/null || true

nginx -t 2>/dev/null && systemctl start nginx
echo "✓ 回滚完成"
```

---

## 📅 时间表 + 关键里程碑

| 步骤 | 你做 | 时间 |
|---|---|---|
| SSH 进主机 | ✓ | 1 分钟 |
| 跑诊断 | ✓ | 30 秒 |
| 贴输出给我 | ✓ | 1 分钟 |
| 下载/上传脚本 | ✓ | 2 分钟 |
| 跑 deploy.sh | ✓ | 3-5 分钟 |
| 改阿里云 DNS | ✓ | 3 分钟 |
| 等 DNS 传播 | ⏳ 自动 | 5-30 分钟 |
| 测试访问 | ✓ | 1 分钟 |
| 让我撤 GitHub Pages cname | 让我做 | 30 秒 |

**总耗时**: ~20 分钟(其中 5-30 分钟是 DNS 等待)

---

## 🤔 卡住了回来找我

任何步骤卡住,**把完整错误信息 + 你已经做的步骤贴给我**,我帮你诊断。

**典型需要我帮的情况**:
- acme.sh 申请证书报错
- nginx 启动失败
- DNS 改了访问不到
- HTTPS 握手失败
- 想优化性能 / 加缓存 / 加监控

---

## 📝 完成后反馈给我

完成后告诉我:
1. ✅ DNS 改了 +访问通了(我会撤 GitHub Pages cname)
2. ❌ 哪一步卡住(我会给你诊断)

---

方案版本: 2026-08-26
作者: echocc00 + Hermes (MiniMax-M3) 协助设计