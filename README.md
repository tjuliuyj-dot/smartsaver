# 🛒 SmartSaver — Grocery Order Tracker for Ghent

> **Track your grocery spending across Ghent supermarkets — one order at a time.**

![Status](https://img.shields.io/badge/Status-MVP-blue)
![Tech](https://img.shields.io/badge/Tech-HTML%20%2B%20CSS%20%2B%20JS-orange)
![License](https://img.shields.io/badge/License-MIT-green)

---

## Overview

SmartSaver is a lightweight, browser-based grocery order tracker designed for daily shopping in Ghent, Belgium. It lets you quickly log what you bought, where, and how much you spent — then gives you a clear overview of your spending habits across your favorite local supermarkets.

**No backend required.** All data is stored locally in your browser via `localStorage`.

---

## ✨ Current Features

### 🏪 Store Directory
- Pre-loaded cards for **OKay Gent**, **Albert Heijn Overpoortstraat**, and **Delhaize Gent Ster**
- Official store images, addresses, and direct links to each store's website
- One-click "Log this store" button to pre-fill the order form

### 📝 Manual Order Entry
- Select a store, enter the date, total amount (€), items purchased, and optional notes
- Orders are saved instantly to browser local storage

### 📊 Spending Dashboard
- **Total orders recorded** — running count of all your entries
- **Total spending** — cumulative amount with per-order average
- **Most visited store** — automatically calculated from your order history

### 📋 Order History
- Chronological list of all past orders with store badges and dates
- Filter by store to see spending at a specific supermarket
- Delete individual orders with confirmation

### 💡 Price Reference
- Simplified price benchmarks for frequently purchased categories (cereal, toilet paper, yoghurt)
- Shows the best unit price from a seed price database for quick reference

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

# 🛒 SmartSaver — 根特超市购物记录工具

> **记录你在根特各超市的购物消费 — 一单一单地攒起来。**

## 简介

SmartSaver 是一个轻量级的浏览器端购物订单记录工具，专为比利时根特市的日常购物设计。快速记录在哪家超市买了什么、花了多少钱，并清晰展示你的消费习惯。

**无需后端。** 所有数据通过 `localStorage` 保存在浏览器本地。

## 当前功能

| 功能 | 说明 |
| :--- | :--- |
| 🏪 **超市目录** | 预置 OKay、Albert Heijn、Delhaize 三家门店卡片，含官方图片和地址 |
| 📝 **手动记单** | 选超市、填日期、总价、买了什么，一键保存 |
| 📊 **消费看板** | 订单总数、累计花费、平均每单、最常去的超市 |
| 📋 **订单历史** | 按时间倒序查看，支持按超市筛选和删除 |
| 💡 **价格参考** | 常买品类（谷物、卷纸、酸奶）的最优单价基准 |

## 使用方法

直接用浏览器打开 `index.html` 即可，无需安装任何依赖。

---

*MIT License*
