# Awesome echocc00

> Portfolio & project index for [@echocc00](https://github.com/echocc00)
>
> Cloud Security · Network Engineering · AI-Driven SecOps

精选 echocc00 维护的开源项目,按领域分组。所有项目均为 Apache-2.0 License,商业合作请联系作者。

---

## 🛡️ Security & SecOps

### [SecSight](https://github.com/echocc00/SecSight) — AI 安全运维平台

> AI 辅助的 SecOps Copilot + 自动处置 SOAR 引擎

- **v0.5.1** · 22 企业剧本 · 5 级自主性 · 234 测试,覆盖率 87.8%
- 集成 Wazuh / Suricata / Shuffle / OpenCTI / DFIR-IRIS
- 4 层知识库 · 进程隔离部署 · 等保 2.0 合规
- 技术栈:LangGraph · LiteLLM · MCP · Qdrant · FastAPI · Vite/React/Antd

### [SecOpent](https://github.com/echocc00/SecOpent) — 授权渗透测试工作台

> Catalog-driven, agent-native **authorized** pentest workbench

- **v1.1.1-stable** · FastAPI + React Case Studio
- LLM only ever *proposes*; deterministic layer + humans decide
- 17 跨资产/web/network/cloud 适配器 · CoverageMatrix · YAML case DSL
- oracle N/N 验证 · seccomp 沙箱 · 三层证据 + 脱敏

### [VidSlice](https://github.com/echocc00/VidSlice) — `opencut-materials`

> 第三方素材向量索引 + Ed25519 签名 + HTTP API

- **v0.7.10** · LanceDB 存储 · 408 测试
- 3 帧提取 · 增量更新 · 并行处理 · NDJSON 进度事件
- 完整 v0.5 向后兼容(读);v0.6 写入通过 `--compat v0.5` opt-in

---

## 🌐 Network Engineering & AI

### [NetSage](https://github.com/echocc00/NetSage) — AI 网络工程师智能平台

> 让 AI 承担设计、配置生成、故障排查、安全审计

- **v0.1.1** · 8 Agent:planner / config_engineer / validator / troubleshooter / deploy / observer / security_auditor / compliance
- 三道闸引擎:Containerlab 仿真 → Batfish 校验 → 人工审批 + 快照回滚
- 多厂商:华为 VRP / Cisco IOS-XE / H3C / Juniper / Arista
- SourceOfTruth 双适配器:NetBox + Nautobot
- 30 条基线规则(CIS + 厂商加固)+ Batfish ACL 分析
- RBAC 五级(viewer/operator/engineer/admin/auditor)

---

## 🎬 Content & Creative AI

### [opencut002](https://github.com/echocc00/opencut002) — OpenCut v3

> AI 多领域短视频生产平台 · 输入素材图片 → 竖版短视频(1080x1920)

- **v0.6.5-cli / v0.6.5-saas** · 20 阶段管道
- 领域配置:education / travel / knowledge_paid / custom
- TTS + Remotion 渲染 · 自动字幕 · BGM 智能匹配
- CLI + SaaS 双轨分发

---

## 📚 Forks & Studies

### [js001](https://github.com/echocc00/js001) — Hydro OJ 二次开发

> [hydro-dev/Hydro](https://github.com/hydro-dev/Hydro) 的镜像 / 二次开发分支

- 信息学在线测评系统 · TypeScript
- License:AGPL-3.0(沿用上游)

---

## 🧰 Meta

### [.github](https://github.com/echocc00/.github) — GitHub profile & shared config

> `profile/README.md` · Apache-2.0

### [awesome-echocc00](https://github.com/echocc00/awesome-echocc00) — 你正在看的这个

> Portfolio index

---

## 📊 按技术分类

| 技术栈 | 涉及项目 |
|---|---|
| LangGraph + LLM | SecSight · SecOpent · NetSage · opencut002 |
| FastAPI | SecSight · SecOpent · NetSage |
| React + Antd | SecSight · SecOpent · NetSage |
| Wazuh + Suricata | SecSight |
| Containerlab + Batfish | NetSage |
| NetBox / Nautobot | NetSage |
| 国产 LLM 适配 | SecSight · NetSage |

## 🎯 当前方向

- **方向 A · 云安全 PM** — 把 SecSight / NetSage / SecOpent 整合成面向中小企业的 AI 安全运营平台
- **方向 B · 甲方攻防 + AI 编排** — AI + Dify/Hermes 驱动的自动化攻防 / 应急响应

## 📫 联系方式

- GitHub:[@echocc00](https://github.com/echocc00)
- 商业合作 / 商业授权:在任一项目 README 顶部"商业授权"段查看

---

<sub>Last updated: 2026-08-23 · All projects Apache-2.0 unless otherwise noted</sub>