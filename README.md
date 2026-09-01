<div align="center">

# ⚡ NATAPOD GEAR — Computer Hardware E-Commerce
### 🛒 Enterprise Full-Stack Web Application for Computer Hardware & Gaming Gear

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Prisma ORM](https://img.shields.io/badge/Prisma-5.0-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![NextAuth.js](https://img.shields.io/badge/NextAuth.js-JWT-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://next-auth.js.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

<p align="center">
  A production-ready, type-safe full-stack e-commerce web platform engineered with <b>Next.js 14 App Router</b>, <b>Prisma ORM</b>, <b>Redux Toolkit</b>, and <b>ACID Database Transactions</b>, designed specifically for high-spec computer components, warranty tracking, promptpay slip uploads, and comprehensive admin suite.
</p>

[✨ Key Features](#-key-features) •
[🏗️ Architecture](#-system-architecture) •
[🗄️ Database Schema](#-database-schema) •
[🚀 Quick Start](#-quick-start) •
[👨‍💻 Author](#-author)

---

</div>

## 📷 Screenshots & Interface Preview

<div align="center">

| 🏠 Storefront & Trending Catalog | 🛒 Interactive Shopping Cart |
| :---: | :---: |
| ![Home](./screenshots/home.png) | ![Shopping Cart](./screenshots/shopping%20cart.png) |

| 📊 Analytics & Sales Dashboard | 📦 Admin Product & Stock CMS |
| :---: | :---: |
| ![Admin Analytics](./screenshots/admin1.png) | ![Admin Dashboard](./screenshots/admin2.png) |

</div>

---

## ✨ Key Features

### 🛍️ 1. Customer Experience
* **⚡ Server-Side Rendering (SSR):** Blazing fast page loads with Next.js Server Components and sub-1.2s page speed.
* **🔍 Deep Hardware Taxonomy & Filtering:** Filter components by Category (CPU, GPU, RAM, Mainboard), Brand, and Price with dynamic JSON specs.
* **🛒 Redux State Cart & Real-Time Math:** Add/remove items, smart quantity adjustments, live 7% VAT & free shipping threshold calculation.
* **📱 PromptPay QR & Slip Upload:** Real-time QR generation for instant mobile banking checkout with proof slip attachment.
* **📦 Order Tracking & Profile Hub:** Order history, expandable order items, tracking numbers, address book management, and wishlist.

### 🛡️ 2. Transaction Integrity & Security
* **🔒 Concurrency-Safe ACID Transactions:** Implemented `prisma.$transaction()` with row-level decrement locks to prevent race conditions and overselling.
* **🔄 Order State Machine:** Strictly enforced order lifecycle: `PENDING ➔ VERIFYING ➔ PAID ➔ SHIPPING ➔ SUCCESS / CANCELLED`.
* **🛡️ Enterprise Authentication:** Secure JWT session management via NextAuth.js with Bcrypt cryptographic password hashing.
* **🧱 Route Protection:** Next.js Edge Middleware safeguards `/admin/*` routes with strict role-based access control (RBAC).

### 📊 3. Admin Management Suite
* **📈 Executive Analytics Hub:** Real-time revenue charts, order distribution pie charts, category sales metrics, and low-stock alerts.
* **🧾 Slip Verification Modal:** Full-size image modal inspection for bank transfer slips with single-click order approval.
* **📦 Complete Product CRUD:** Multi-image upload, rich description editor, dynamic JSON hardware specs editor, and live inventory control.
* **👥 User & Address Management:** Customer directory with order history audit trail.

---

## 🏗️ System Architecture

```mermaid
graph TD
    Client[Client Browser / Mobile PWA] -->|HTTPS Requests| NextServer[Next.js 14 App Router]
    
    subgraph Presentation & State
        NextServer --> RSC[React Server Components]
        NextServer --> RCC[Client Components + Redux Toolkit]
        NextServer --> Middleware[Edge Auth Middleware]
    end
    
    subgraph Backend & Business Logic
        NextServer --> API[Route Handlers & Server Actions]
        API --> NextAuth[NextAuth.js JWT & Bcrypt]
        API --> Transactions[Prisma ACID Transactions]
    end
    
    subgraph Persistence Layer
        Transactions --> PrismaClient[Prisma ORM Client]
        PrismaClient --> RelationalDB[(MySQL / PostgreSQL)]
    end
```

---

## 🗄️ Database Schema

```mermaid
erDiagram
    User ||--o{ Order : places
    User ||--o{ Address : owns
    User ||--o{ Wishlist : saves
    Order ||--|{ OrderItem : contains
    Product ||--|{ OrderItem : includes
    Product ||--o{ ProductImage : has
    Product ||--o{ Wishlist : saved_in

    User {
        string id PK
        string name
        string email UK
        string password
        string role "USER | ADMIN"
    }

    Product {
        string id PK
        string name
        string category
        string brand
        string sku UK
        decimal price
        decimal discountPrice
        int stock
        string warranty
        json specs
    }

    Order {
        string id PK
        string userId FK
        decimal total
        string status "PENDING | VERIFYING | PAID | SHIPPING | SUCCESS | CANCELLED"
        string paymentMethod "bank | promptpay | cod"
        string paymentSlip
        string trackingNumber
    }
```

---

## 🚀 Quick Start

### 1. Clone the Repository
```bash
git clone https://github.com/ntpd-ksk/ecommerce-fullstack.git
cd ecommerce-fullstack
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create a `.env` file in the root directory:
```env
DATABASE_URL="mysql://root:password@localhost:3306/ecommerce_db"
NEXTAUTH_SECRET="your-super-secret-jwt-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Setup Database with Prisma
```bash
npx prisma generate
npx prisma db push
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **👑 Admin** | `admin@admin.com` | `admin123` | Full Access (`/admin/dashboard-analytics`) |
| **👤 Customer** | `customer@test.com` | `password123` | Storefront & Checkout (`/profile`) |

---

## 👨‍💻 Author

* **Developer:** นาย ณฐพจน์ กสิกรณ์ (Natapod Kasikorn)
* **Student ID:** 6500930
* **Major:** Computer Science (วิทยาการคอมพิวเตอร์)
* **Institution:** Faculty of Digital Technology and Innovation, Rangsit University
* **GitHub:** [@ntpd-ksk](https://github.com/ntpd-ksk)

---
<div align="center">
  <sub>⭐ If you find this project helpful, please star the repository! ⭐</sub>
</div>
