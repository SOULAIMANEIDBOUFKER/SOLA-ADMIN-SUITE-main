#SOLA-ADMIN-SUITE— Ticketing Admin Dashboard (React + TypeScript)

A modern **frontend-only** ticketing dashboard with **role-based access**, **DE/EN i18n**, and a clean **dark UI** built for portfolio/demo use.

## ✨ Key Features
- 🔐 **Authentication + Protected Routes**
- 🧩 **RBAC / Role Guard** (Admin, Staff, Viewer)
- 🎫 **Tickets module**: list, search, filters, details, create, delete
- 📊 **Dashboard analytics** (charts + recent activity)
- 🌍 **i18n**: English / Deutsch switch
- 🎨 **Theme**: light / dark / system
- 🧱 Reusable UI kit (shadcn/ui + Radix)

## 👤 Demo Accounts
- **Admin:** `admin@sola.dev` / `admin123`
- **Staff:** `staff@sola.dev` / `staff123`
- **Viewer:** `viewer@sola.dev` / `viewer123`

## 🧰 Tech Stack
React 18, TypeScript, Vite, TailwindCSS, shadcn/ui (Radix UI), React Router, React Query, i18next, Recharts, Vitest.

## 🚀 Getting Started
```bash
npm install
npm run dev
Open: http://localhost:8080

Scripts
npm run build
npm run preview
npm run lint
npm run test
🗂️ Project Structure (short)
src/pages — Dashboard, Tickets, Users, Settings, Auth

src/components/auth — ProtectedRoute, RoleGuard

src/contexts — Auth + Theme context

src/lib — api, i18n, rbac helpers

src/locales/{en,de} — translation files

src/services — mock/data services layer

SolaDesk — Ticketing Admin Dashboard (React + TypeScript) 🇩🇪
Ein modernes Frontend-only Ticket-Dashboard mit rollenbasiertem Zugriff, DE/EN i18n und einem sauberen Dark UI — ideal für Portfolio und Demos.

✨ Hauptfeatures
🔐 Login + geschützte Routen

🧩 RBAC / Rollenverwaltung (Admin, Staff, Viewer)

🎫 Tickets: Liste, Suche, Filter, Details, Erstellen, Löschen

📊 Dashboard-Analysen (Charts + letzte Aktivitäten)

🌍 Mehrsprachig: Englisch / Deutsch

🎨 Design-Modus: hell / dunkel / system

🧱 Wiederverwendbare UI-Komponenten (shadcn/ui + Radix)

👤 Demo-Zugänge
Admin: admin@sola.dev / admin123

Staff: staff@sola.dev / staff123

Viewer: viewer@sola.dev / viewer123

🚀 Schnellstart
npm install
npm run dev
Öffnen: http://localhost:8080
