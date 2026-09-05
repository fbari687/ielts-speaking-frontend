# Mini IELTS Speaking Evaluation - Frontend Client

Single Page Application (SPA) modern untuk platform simulasi dan evaluasi otomatis IELTS Speaking berbasis AI. Antarmuka ini dibangun menggunakan Vue 3 Composition API, PrimeVue UI Component Suite, Tailwind CSS, serta terhubung dengan backend REST API Laravel melalui otentikasi stateless Bearer Token (Sanctum).

---

## Deployment & Repository Links

- **Backend Repository**: [Link GitHub Backend](https://github.com/fbari687/ielts-speaking-backend)
- **Live Demo (Frontend)**: [Link Live Demo Vercel](https://ielts-speaking-roan.vercel.app)
- **Production API Base URL**: [Link Production API Backend](https://ielts.fbariaja.my.id)

---

## Key Features

- **Decoupled Architecture**: Arsitektur SPA independen yang berkomunikasi murni via asynchronous REST API client (Axios).
- **Authentication & Protected Views**: Sistem registrasi, login, session persistence (`localStorage`), dan auto-logout via Axios interceptor saat token kadaluarsa (`401`).
- **Vue Router with Navigation Guards**: Proteksi rute berbasis state otentikasi (`requiresAuth` untuk Dashboard, `guestOnly` untuk Login/Register).
- **Interactive Evaluation Dashboard**:
- Pilihan prompt topik IELTS Speaking (Part 1, 2, atau 3).
- Input transkripsi jawaban dengan validasi panjang teks real-time.
- Tabel riwayat speaking attempt spesifik milik user yang sedang aktif.
- Dialog pop-up interaktif menampilkan rincian hasil evaluasi Gemini AI (IELTS Band Score, Strengths, dan Areas to Improve).

- **Modern Responsive UI**: Desain antarmuka bersih berbasis Tailwind CSS dan komponen PrimeVue bertema Aura.

---

## Tech Stack

- **Framework**: Vue 3 (Composition API `<script setup>`)
- **Build Tool**: Vite
- **UI Components**: PrimeVue v4 (Aura Preset Theme) & PrimeIcons
- **CSS Utility**: Tailwind CSS
- **Routing**: Vue Router v4 (HTML5 History Mode)
- **HTTP Client**: Axios (dengan Interceptor penanganan Bearer Token)

---

## Getting Started (Local Setup)

### Prerequisites

- Node.js >= 18.x
- npm atau pnpm / yarn
- Backend Laravel API yang sudah berjalan di lokal (`[http://127.0.0.1:8000](http://127.0.0.1:8000)`)

### Installation Steps

1. **Clone Repository & Masuk ke Folder Project**:

   ```bash
   git clone
   cd ielts-speaking-frontend
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Konfigurasi File Environment**:
   Salin file template `.env.example` (atau buat file `.env` baru di root project):

   ```env
   VITE_API_BASE_URL=http://127.0.0.1:8000/api
   VITE_PRIMEVUE_LICENSE_KEY=your-primevue-license
   ```

   bisa claim free [Disini](https://primeui.store/primeui)

4. **Jalankan Development Server**:

   ```bash
   npm run dev
   ```

   Aplikasi frontend dapat diakses melalui browser pada `http://localhost:5173`.

---

## Project Structure

```text
src/
├── assets/          # Static assets & styling
├── router/          # Definisi Vue Router & Navigation Guards
│   └── index.js
├── services/        # HTTP API layer (Axios instance & interceptors)
│   ├── api.js
│   ├── authService.js
│   └── speakingService.js
├── views/           # Dedicated SPA Pages
│   ├── DashboardView.vue
│   ├── LoginView.vue
│   └── RegisterView.vue
├── App.vue          # Root component dengan shell RouterView & Toast
├── main.js          # Entry point aplikasi (Inisialisasi PrimeVue & Router)
└── style.css        # Tailwind CSS imports & custom styles

```

---

## Production Build & Deployment

Untuk mendeploy project ini ke hosting platform statis seperti **Vercel**:

1.  **Production Build**:
    ```bash
    npm run build
    ```
    Perintah ini akan mengompilasi seluruh asset ke direktori `dist/`.
2.  **SPA Routing Configuration (`vercel.json`)**:
    Karena Vue Router menggunakan mode HTML5 History, konfigurasi routing rewrite berikut telah disertakan pada root project agar navigasi URL langsung atau refresh halaman tidak menghasilkan error 404:

    ````json
    {
    "rewrites": [
    {
    "source": "/(.*)",
    "destination": "/index.html"
    }
    ]
    }

        ```

    ````

3.  **Environment Variable di Hosting**:
    Pastikan mendaftarkan kedua environment variable berikut pada dashboard hosting (misal: Vercel Project Settings > Environment Variables):

- `VITE_API_BASE_URL`: URL backend API production (contoh: `https://api.domainkamu.com/api`).
- `VITE_PRIMEVUE_LICENSE_KEY`: License key PrimeVue yang valid.
