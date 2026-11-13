# Alat Kopi Malang Web Platform

> Public-facing ecommerce, brand, and coffee equipment experience website for **Alat Kopi Malang** (Malang, East Java).

---

## 💻 Tech Stack

* **Framework:** Laravel 13
* **Admin Panel:** Filament 5
* **Frontend:** Inertia.js + React 19 + TypeScript
* **Styling:** Tailwind CSS v4
* **Database:** MariaDB / MySQL
* **Production URL:** [https://alatkopimalang.co.id](https://alatkopimalang.co.id)
* **Admin URL:** [https://alatkopimalang.co.id/admin](https://alatkopimalang.co.id/admin)

---

## ⚡ Quick Start

```bash
# Install PHP & Node dependencies
composer install
npm install

# Setup environment & database
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
npm run build
```

# Start development servers
npm run dev
```