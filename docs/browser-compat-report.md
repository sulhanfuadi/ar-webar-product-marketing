# WebAR Browser Compatibility Test Report

**Judul Paper:** Development of Interactive WebAR 3D Product Poster  
**Tanggal Pengujian:** 2026-06-11 09:18:20 UTC  
**Tool:** Playwright v1.60.0  
**URL Pengujian:** http://localhost:4173 (Vite Preview Build)  
**Metode:** Automated headless browser emulation + real browser engines

---

## Ringkasan Hasil

| Metrik | Nilai |
|--------|-------|
| Total Test Case | 363 |
| Passed ✅ | 356 |
| Skipped ⏭️ | 7 |
| Failed ❌ | 0 |
| Pass Rate | 100% |
| Durasi Total | 107.7s |

---

## Tabel Kompatibilitas Browser per Platform

### 💻 Desktop

| Browser | Status | WebGL | WASM | Camera API | ES Modules | Import Maps | CSS dvh | backdrop-filter | Test Passed | Test Failed |
|---------|--------|-------|------|------------|------------|-------------|---------|-----------------|-------------|-------------|
| Desktop Chrome | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 33 | 0 |
| Desktop Firefox | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 33 | 0 |
| Desktop Safari (WebKit) | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 33 | 0 |

### 🍎 iOS (iPhone 14)

| Browser | Status | WebGL | WASM | Camera API | ES Modules | Import Maps | CSS dvh | backdrop-filter | Test Passed | Test Failed |
|---------|--------|-------|------|------------|------------|-------------|---------|-----------------|-------------|-------------|
| iPhone 14 – Safari (WebKit) | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |
| iPhone 14 – Chrome iOS (WebKit) | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |
| iPhone 14 – Firefox iOS (WebKit) | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |

### 🤖 Android (Pixel 7)

| Browser | Status | WebGL | WASM | Camera API | ES Modules | Import Maps | CSS dvh | backdrop-filter | Test Passed | Test Failed |
|---------|--------|-------|------|------------|------------|-------------|---------|-----------------|-------------|-------------|
| Pixel 7 – Chrome Android | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |
| Pixel 7 – Samsung Internet | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |
| Pixel 7 – Firefox Android | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 33 | 0 |
| Pixel 7 – Opera Android | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |
| Pixel 7 – UC Browser Android | ✅ Compatible | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | 32 | 0 |

---

## Cakupan Pengujian

| # | Kategori Test | Deskripsi |
|---|---------------|-----------|
| 1 | Routing & Page Load | Redirect /, load tanpa JS error, judul halaman |
| 2 | Browser Feature Support | WebGL, WebGL2, WebAssembly, getUserMedia, ES Modules, Import Maps, CSS dvh, backdrop-filter |
| 3 | Layout & UI Structure | Container AR, header, tombol Restart |
| 4 | QA Preview Mode | Marker-locked UI, action bar (Contact, Buy, Specification) |
| 5 | Specification Modal | Buka/tutup modal spesifikasi produk |
| 6 | 3D Model Detail Modal | Buka modal, tombol Reset View |
| 7 | Viewport Responsiveness | 360×780, 390×844, 412×915, 768×1024, 1280×800 |
| 8 | Security Context | isSecureContext (wajib untuk getUserMedia) |
| 9 | Performance Baseline | Load time < 10s, tidak ada resource blocking |

---

## Analisis WebAR Browser Support

### Fitur Wajib WebAR

| Fitur | Kegunaan | Status |
|-------|----------|--------|
| WebGL / WebGL2 | Rendering 3D (Three.js) | Wajib |
| WebAssembly | Image tracking (MindAR) | Wajib |
| getUserMedia | Akses kamera | Wajib |
| ES Modules + Import Maps | Vendor loading | Wajib |
| HTTPS / Secure Context | getUserMedia wajib HTTPS | Wajib |

### Fitur Pendukung

| Fitur | Kegunaan | Status |
|-------|----------|--------|
| CSS dvh units | Full-screen AR viewport | Direkomendasikan |
| CSS backdrop-filter | UI glassmorphism | Direkomendasikan |

---

## Catatan Pengujian

> **Batasan Emulasi:**  
> Pengujian menggunakan Playwright browser emulation (headless) dengan fake media stream.  
> Kamera AR (MindAR image tracking) tidak dapat diuji secara penuh dalam lingkungan headless —  
> pengujian marker tracking dan overlay 3D memerlukan pengujian manual di perangkat nyata.

> **Desktop Mode:**  
> Pada desktop, aplikasi otomatis masuk mode *preview* (tanpa kamera) karena logika  
> `isProbablyMobile()` mendeteksi non-mobile UA. Test pada desktop memverifikasi  
> UI dan fitur browser, bukan AR tracking.

> **Firefox Android:**  
> Playwright tidak mendukung `isMobile` option pada Firefox. Pengujian Firefox Android  
> menggunakan Firefox desktop engine dengan viewport Pixel 7 dan UA string Firefox Android.

> **Desktop Edge:**  
> Microsoft Edge tidak terinstal secara default di macOS.  
> Untuk mengaktifkan pengujian Edge: `npx playwright install msedge` lalu uncomment  
> project *Desktop Edge* di `playwright.config.ts`.

---

## Kesimpulan

Berdasarkan hasil pengujian automated:

- **Semua browser yang diuji** mendukung fitur-fitur wajib WebAR (WebGL, WebAssembly, getUserMedia, ES Modules)
- **iOS browsers** (Safari, Chrome iOS, Firefox iOS) semuanya berjalan di atas WebKit engine — kompatibilitas identik secara teknis
- **Android browsers** (Chrome, Samsung Internet, Opera, UC Browser) semuanya berjalan di atas Chromium engine — kompatibilitas identik secara teknis  
- **Firefox Android** menggunakan Gecko engine — kompatibel berdasarkan hasil test
- Pengujian **perangkat nyata** tetap diperlukan untuk validasi AR tracking, performa kamera, dan orientasi layar

---

_Laporan dibuat otomatis oleh `scripts/generate-compat-report.mjs`_
