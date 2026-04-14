# 🛒 SmartSaver — Smart Grocery Tracker for Ghent

> **Scan, track, and compare your grocery spending across Ghent supermarkets.**

![Status](https://img.shields.io/badge/Status-MVP-blue)
![Tech](https://img.shields.io/badge/Tech-HTML%20%2B%20CSS%20%2B%20JS-orange)
![Language](https://img.shields.io/badge/Language-Dutch%20%2F%20NL-red)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

SmartSaver is a smart, browser-based grocery tracker designed for daily shopping in Ghent, Belgium. Take a photo of a product or price tag, and the app automatically recognizes the item — primarily in **Dutch (Nederlands)** — and instantly loads your historical price records for comparison. You can also manually log orders and track your spending habits across your favorite local supermarkets.

The built-in price database contains 20+ common products with Dutch product names (e.g., *Havermout*, *Komkommer*, *Toiletpapier*), unit prices, and Nutri-Score ratings, making it easy to compare prices on the spot.

**No backend required.** All data is stored locally in your browser via `localStorage`.

---

## ✨ Features

### 📸 Photo Recognition
- Take a photo of a product or price tag to automatically identify the item
- Optimized for **Dutch-language** product labels and price tags
- Instantly loads matching historical price records for comparison

### 🏪 Store Directory
- Pre-loaded cards for **OKay Gent**, **Albert Heijn Overpoortstraat**, and **Delhaize Gent Ster**
- Official store images, addresses, and direct links to each store's website
- One-click "Log this store" button to pre-fill the order form

### 📝 Order Entry
- Select a store, enter the date, total amount (€), items purchased, and optional notes
- Orders are saved instantly to browser local storage
- Manual input fallback when photo recognition is unavailable

### 📊 Spending Dashboard
- **Total orders recorded** — running count of all your entries
- **Total spending** — cumulative amount with per-order average
- **Most visited store** — automatically calculated from your order history

### 📋 Order History
- Chronological list of all past orders with store badges and dates
- Filter by store to view spending at a specific supermarket
- Delete individual orders with confirmation

### 💡 Price Reference Database
- 20+ products with Dutch names, brands, unit prices, and Nutri-Score ratings
- Covers categories: groceries, meat & seafood, vegetables, dairy, and household items
- Automatically finds the best unit price for frequently purchased categories (cereal, toilet paper, yoghurt)

---

## 🚀 Getting Started

Simply open `index.html` in any modern browser. No build tools, no installation, no server required.

```bash
# Clone the repo
git clone https://github.com/tjuliuyj-dot/smartsaver.git

# Open in browser
open index.html
```

---

## 📁 Project Structure

```
smartsaver/
├── index.html              # Main page
├── styles.css              # Styling
├── app.js                  # Application logic (vanilla JS)
├── assets/                 # Official store images
│   ├── okay-gent-official.jpg
│   ├── ah-overpoort-official.png
│   └── delhaize-gent-ster-official.png
├── data/
│   ├── prices.js           # Seed price reference data
│   ├── prices.md           # Price data documentation
│   └── deploy-skill.md     # Deployment notes
└── README.md
```

---

## 🗺️ Future Roadmap

| Phase | Features |
| :--- | :--- |
| **Phase 1** | AI-powered price tag scanning via camera (Gemini API) |
| **Phase 2** | Cross-store price history timeline and comparison |
| **Phase 3** | Receipt batch import and Nutri-Score health indicators |

---

## 🛠️ Tech Stack

- **Frontend**: Vanilla HTML + CSS + JavaScript
- **Storage**: Browser `localStorage` (no backend)
- **Images**: Official store photos sourced from store websites (as of April 2026)

---

# 🛒 SmartSaver — 根特智能购物追踪工具

> **拍照识别、记录消费、比价省钱 — 专为根特留学生设计。**

## 简介

SmartSaver 是一个浏览器端的智能购物工具，专为比利时根特市的日常购物设计。拍摄商品或价签照片，即可**自动识别商品（主要支持荷兰语）**，并立刻加载历史价格记录进行对比。你也可以手动记录订单，追踪消费习惯。

内置 20+ 种常见商品的荷兰语名称（如 *Havermout*、*Komkommer*、*Toiletpapier*）、单价和 Nutri-Score 评分。

**无需后端。** 所有数据通过 `localStorage` 保存在浏览器本地。

## 功能

| 功能 | 说明 |
| :--- | :--- |
| 📸 **拍照识别** | 拍摄商品/价签照片，自动识别物品名称（荷兰语优化），立刻加载历史记录 |
| 🏪 **超市目录** | 预置 OKay、Albert Heijn、Delhaize 三家门店卡片，含官方图片和地址 |
| 📝 **订单记录** | 选超市、填日期、总价、买了什么，一键保存 |
| 📊 **消费看板** | 订单总数、累计花费、平均每单、最常去的超市 |
| 📋 **订单历史** | 按时间倒序查看，支持按超市筛选和删除 |
| 💡 **价格数据库** | 20+ 种商品的荷兰语名称、品牌、单价、Nutri-Score 评分 |

## 使用方法

直接用浏览器打开 `index.html` 即可，无需安装任何依赖。

---

*MIT License*

