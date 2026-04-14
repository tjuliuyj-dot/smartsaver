# 🚀 Deploy Skill — 一键项目部署助手

**版本：** v1.0
**适用范围：** /Volumes/mac mini /Projects/ 下的所有前端与后端项目

---

## 技能目标

用一句话触发，自动识别项目类型，执行构建，部署上线，返回公网访问地址。

**触发示例：**
- `"帮我把 OfferRadar 部署上线"`
- `"deploy GainPath"`
- `"/deploy Personalweb"`

---

## 支持的平台

用户可在触发时自由指定部署平台，skill 自动适配对应流程。

| 平台 | 适合类型 | 触发示例 |
| :--- | :--- | :--- |
| **Netlify** | 静态、Vite、Astro | `"部署 OfferRadar 到 Netlify"` |
| **Vercel** | 静态、Vite、Astro、Next.js | `"部署 Personalweb 到 Vercel"` |
| **Railway** | Python 后端 | `"部署 travelplan 到 Railway"` |

> 若用户未指定平台，skill 根据项目类型自动推荐默认平台（见下方各类型说明）。

---

## 支持的项目类型

### 类型 A — 纯静态 (Static HTML/JS/CSS)
**识别特征：** 根目录有 `index.html`，无 `package.json`
**项目举例：** GainPath、MBTI Free test、timealign
**默认平台：** Netlify

**Netlify 部署流程：**
1. 将 `index.html` + 所有 JS/CSS/assets 打包成 ZIP
2. 通过 Netlify API 上传 ZIP 部署
3. 返回 `https://[site-name].netlify.app`

**Vercel 部署流程：**
1. 通过 Vercel CLI 执行 `vercel --prod`（无需构建步骤）
2. 返回 `https://[site-name].vercel.app`

---

### 类型 B — Vite/React SPA
**识别特征：** `package.json` 中有 `"vite"` 依赖
**项目举例：** OfferRadar
**默认平台：** Vercel

**Netlify 部署流程：**
1. `npm install` → `npm run build` → 生成 `dist/`
2. 通过 Netlify API 上传 `dist/` 目录部署
3. 返回公网地址

**Vercel 部署流程：**
1. `npm install` → `npm run build`
2. `vercel --prod` 自动识别 Vite 框架
3. 返回公网地址

---

### 类型 C — Astro 框架
**识别特征：** `package.json` 中有 `"astro"` 依赖
**项目举例：** Personalweb
**默认平台：** Vercel

**Netlify 部署流程：**
1. `npm install` → `npm run build` → 生成 `dist/`
2. 通过 Netlify API 上传 `dist/` 目录部署

**Vercel 部署流程：**
1. `npm install` → `npm run build`
2. `vercel --prod` 自动识别 Astro 框架

---

### 类型 D — Python 后端
**识别特征：** 根目录有 `requirements.txt` 或 `pyproject.toml`
**项目举例：** travelplan、Browser-control
**默认平台：** Railway

**Railway 部署流程：**
1. 检查是否已连接 Git 远程仓库，若无则提示先推送到 GitHub
2. 通过 Railway CLI 执行 `railway up`
3. 返回 Railway 分配的公网地址

**Vercel 部署流程（仅适用于有 API Routes 的 Python 项目）：**
1. 需要项目根目录有 `vercel.json` 配置文件
2. `vercel --prod` 部署
3. 注意：Railway 对 Python 支持更完善，Vercel Python 有冷启动限制

---

### 类型 E — iOS 原生 App（不在此 skill 范围内）
**项目举例：** LifeReminders

**说明：** iOS App 需要 Apple Developer 账号 + Xcode Archive + TestFlight/App Store 审核，流程独立，不在本 skill 处理范围内。触发时给出提示说明。

---

## Skill 执行逻辑（伪代码）

```
function deploy(project_name):
  path = /Volumes/mac mini /Projects/{project_name}

  if not exists(path):
    return "❌ 找不到项目：{project_name}"

  type = detect_type(path):
    if path/index.html exists AND no package.json → Type A
    if package.json has "vite"               → Type B
    if package.json has "astro"              → Type C
    if requirements.txt or pyproject.toml   → Type D
    if .xcodeproj exists                    → Type E

  execute deploy flow for detected type
  return "✅ 部署成功：{url}"
```

---

## 配置项（需要预设）

| 配置项 | 说明 |
| :--- | :--- |
| `NETLIFY_TOKEN` | Netlify 个人访问令牌，存于 `~/.env` |
| `VERCEL_TOKEN` | Vercel 个人访问令牌，存于 `~/.env` |
| `RAILWAY_TOKEN` | Railway CLI 令牌，存于 `~/.env` |

> ⚠️ **安全提示：** timealign 的 `deploy.sh` 中 Token 是明文硬编码的，存在泄露风险。所有 Token 应统一存入 `~/.env` 或系统环境变量，不应出现在代码文件中。

---

## 已知项目部署映射表

| 项目 | 类型 | 平台 | 现有站点 |
| :--- | :--- | :--- | :--- |
| timealign | A - 静态 | Netlify | https://timealign.netlify.app |
| GainPath | A - 静态 | Netlify | 待创建 |
| MBTI Free test | A - 静态 | Netlify | 待创建 |
| OfferRadar | B - Vite/React | Netlify | 待创建 |
| Personalweb | C - Astro | Netlify | 待创建 |
| travelplan | D - Python | Railway | 待创建 |
| LifeReminders | E - iOS | — | 不适用 |

---

## 后续扩展（可选）

- 支持自定义域名绑定（`netlify sites:create --name my-domain`）
- 部署前自动运行测试（`npm test`）
- 部署成功后自动更新 `projects-showcase.html` 中的项目链接
