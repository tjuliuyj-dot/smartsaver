# 🛒 SmartSaver — Smart Price Comparison & Healthy Shopping Assistant

> **Your personal mobile supermarket brain — scan, compare, save.**

![Status](https://img.shields.io/badge/Status-MVP%20Planning-blue)
![Version](https://img.shields.io/badge/Version-1.1-green)
![Updated](https://img.shields.io/badge/Updated-2026--04--11-lightgrey)

---

## 1. Product Vision

SmartSaver aims to be your personal "mobile supermarket brain".

Simply take a photo of a price tag, product packaging, or receipt with your phone — the AI model will automatically parse and structure the product and pricing data, gradually building your personal cross-store price benchmark database. The system helps you instantly calculate the real unit price in complex promotional environments (e.g., "how much does each roll actually cost?"), and combined with health indicators like Nutri-Score, provides the smartest purchasing decisions.

---

## 2. Target Users & Core Scenarios

**Target Users:** Budget-conscious consumers who shop across multiple supermarkets (OKay, Albert Heijn, Kruidvat, Delhaize) and have health-conscious dietary needs (low sugar, low fat).

| Scenario | Description |
| :--- | :--- |
| **Shelf Hesitation** | Facing two toilet papers with different specs — which one is actually cheaper per roll? |
| **Spot Fake Deals** | Seeing a discount tag — is it really cheaper than your historical lowest price elsewhere? |
| **Health Check** | Comparing two cereal boxes — quickly find the one with no added sugar |
| **Post-Shopping Review** | Upload your receipt after checkout to automatically update your personal "price floor database" |

---

## 3. Core Features

### 3.1 AI Vision Scanner (Smart Multi-Modal Input)

- **FR-1.1 Price Tag Recognition:** Photograph a price tag to auto-extract product name, brand, current price, and package specification (e.g., 8 rolls, 500g)
- **FR-1.2 Receipt Parsing:** Photograph a receipt to auto-identify store name, date, and batch-convert all items to structured data
- **FR-1.3 Manual Input Fallback:** When image quality is poor or AI fails, users can manually enter product info
- **FR-1.4 Unit Standardization:** Backend auto-calculates unified comparison units, e.g., `€/kg`, `€/L`, `€/roll`, `€/100g`

> ⚠️ **Unit Note:** "8-roll pack" and "4-roll double-layer pack" cannot be directly compared. The system needs preset conversion rules (e.g., double-layer = 1.5× standard roll), prompting users for confirmation when uncertain.

### 3.2 Cross-Store Price Database

- **FR-2.1 Price Timeline:** Track the same product's price fluctuations across stores, auto-marking the historical lowest price
- **FR-2.2 Product Deduplication:** Match scanned products with existing records via barcode or AI fuzzy name matching
- **FR-2.3 Cross-Brand Comparison:** Support manually binding different brands of the same category (e.g., AH wood pulp tissue vs Everyday tissue)

### 3.3 Live Decision Assistant

- **FR-3.1 Shelf PK Mode:** Photograph two products simultaneously, or compare the current product with historical data, outputting a recommendation (e.g., "Choose the left one — 15% cheaper per unit and higher Nutri-Score")
- **FR-3.2 Health Indicator Extraction:** Identify Nutri-Score labels or extract key ingredients (e.g., `0% Added Sugar`, `High Protein`)
- **FR-3.3 Price Traffic Light:** Instant display of current price vs personal historical average (green = good deal, red = overpriced)

### 3.4 User Account

- **FR-4.1 Login/Register:** Email or Google login, ensuring price data is bound to personal accounts with multi-device sync

---

## 4. Data Model

| Table | Key Fields | Description |
| :--- | :--- | :--- |
| **Users** | `id`, `email`, `created_at` | User accounts, basis for data isolation |
| **Products** | `id`, `name`, `brand`, `category`, `barcode`, `nutri_score` | Common product info, barcode for precise dedup |
| **Stores** | `id`, `name`, `chain` (e.g., AH), `location` | Store info |
| **Price_History** | `id`, `product_id`, `store_id`, `user_id`, `price`, `unit_type`, `unit_price`, `scanned_at`, `is_promotion` | Core price database, real price records per scan |
| **Scans** | `id`, `user_id`, `image_url`, `ai_raw_output`, `status`, `created_at` | Raw scan logs for traceability and AI accuracy optimization |

---

## 5. Tech Stack

### MVP Architecture (Solo Dev, Rapid Launch)

```
Frontend (Next.js PWA)
    ↓ API Routes
AI Engine (Gemini API)   ←→   Database (Supabase / PostgreSQL)
```

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend** | Next.js 15 (React) + Tailwind CSS | Built-in API Routes, no separate backend needed; PWA supports camera access |
| **AI Engine** | Google Gemini API (multimodal) | Direct image input, structured JSON output, no OCR training needed |
| **Database** | Supabase (hosted PostgreSQL) | Built-in auth, file storage, real-time subscriptions, zero ops |
| **Deployment** | Vercel | Seamless Next.js integration, free tier sufficient for MVP |

### AI Prompt Example

```
You are a supermarket price tag parser. Analyze the image and return JSON:
{
  "name": "Product name",
  "brand": "Brand",
  "total_price": number (EUR),
  "quantity": number,
  "unit": "unit (roll/g/L/pc)",
  "is_promotion": true/false
}
Set any unrecognizable field to null.
```

---

## 6. Roadmap

### Phase 1 — MVP Core

- [ ] Next.js project init, PWA config (camera access)
- [ ] Gemini API integration: price tag image → structured JSON
- [ ] Supabase schema, price entry & unit price display
- [ ] User login/register (Supabase Auth)
- [ ] Manual input fallback UI

### Phase 2 — Price Memory

- [ ] Product deduplication (barcode first, AI name matching fallback)
- [ ] Price timeline visualization
- [ ] Price traffic light (current vs personal historical average)
- [ ] Cross-brand same-category binding

### Phase 3 — Receipt Batch & Health Mode

- [ ] Full receipt recognition, batch import
- [ ] Nutri-Score & nutrition label extraction
- [ ] Shelf PK mode (dual product comparison)
- [ ] PWA offline cache (for poor in-store network)

---

## 7. Open Decisions

Two key questions to resolve before coding:

1. **Where does cold-start data come from?**
   - Option A (recommended for MVP): Use only user-scanned historical data. No cross-store comparison initially, but simple and compliant.
   - Option B (future expansion): Pre-load public price data or connect to store APIs (requires compliance review).

2. **How to confirm "same product"?**
   - Primarily use barcode for exact matching.
   - Without barcode, AI compares product name + specs. Auto-link if similarity exceeds threshold; otherwise prompt user confirmation.

---

# 🛒 SmartSaver — 个人智能比价与健康购物助手

> **你的私人移动超市外脑 — 拍照、比价、省钱。**

---

## 产品愿景

用户只需用手机拍摄价签、商品包装或购物小票，AI 大模型将自动解析并结构化商品与价格数据，逐步建立起个人专属的跨超市价格基准库。系统帮助用户在复杂的促销环境中瞬间算出真实单价（如"每卷纸实际多少钱"），并结合 Nutri-Score 等健康指标，给出最聪明的购买决策。

## 目标用户

习惯在多家超市（OKay、Albert Heijn、Kruidvat、Delhaize）比价购物、对物价敏感，且有一定健康饮食需求（控糖、减脂）的消费者。

## 核心功能

| 功能 | 说明 |
| :--- | :--- |
| 📸 **AI 拍照识别** | 拍摄价签/小票，自动提取商品名称、价格、规格 |
| 📊 **跨店比价库** | 记录历史价格波动，自动标记最低价 |
| 🚦 **比价红绿灯** | 实时显示当前价格与历史均价对比 |
| 🏷️ **货架 PK** | 两款商品对比，输出推荐结论 |
| 🥗 **健康指标** | 识别 Nutri-Score、无糖、高蛋白等标识 |
| 🧾 **小票批量录入** | 购物后上传小票，批量更新价格库 |

## 技术栈

`Next.js 15` · `Tailwind CSS` · `Google Gemini API` · `Supabase` · `Vercel`

---

*MIT License*
