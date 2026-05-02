# Nova X Vision Smart Poster AR

Demo final smart poster berbasis marker untuk presentasi tugas/pitch smartphone, menggabungkan landing page, WebAR marker-based, hotspot fitur, dan chatbot FAQ ringan yang siap di-upgrade ke LLM/API di tahap berikutnya.

## Stack
- Vite vanilla
- A-Frame
- AR.js
- Chatbot lokal berbasis knowledge base

## Jalankan project
```bash
npm install
npm run dev
```

## Build production
```bash
npm run build
npm run preview
```

## Smoke test
```bash
npm run smoke:test
```

## Flow demo
- Buka landing page.
- Tekan `Masuk Mode AR`.
- Izinkan akses kamera di browser mobile.
- Arahkan kamera ke marker pada poster.
- Saat marker terkunci, smartphone AR muncul di atas poster.
- Tap hotspot untuk menjelaskan fitur unggulan.
- Gunakan panel FAQ untuk menjawab pertanyaan calon pembeli.
- Tekan CTA untuk membuka halaman penawaran produk.

## Source of truth
- `src/config/content.js` menyimpan branding, copy produk, state AR, CTA, marker, model, dan knowledge base chatbot.
- `src/lib/arScene.js` membangun seluruh markup landing page, chatbot, dan AR scene.
- `src/lib/chatbot.js` menangani normalisasi pertanyaan dan pencocokan FAQ sederhana.
- `src/main.js` mengelola state runtime, camera permission, marker event, hotspot interaction, dan UI chatbot.

## Asset final yang bisa diganti
- `public/assets/poster/poster-preview.svg` untuk preview poster final.
- `public/assets/poster/poster-marker-guide.svg` untuk panduan area marker pada layout poster.
- `public/assets/markers/custom-marker-reference.svg` untuk tampilan marker reference.
- `public/assets/markers/custom-marker-placeholder.patt` untuk pattern AR.js marker custom.
- `public/assets/branding/brand-thumb.svg` untuk thumb identitas proyek.
- `public/assets/models/phone-demo.glb` untuk model final jika nanti tersedia.

## Cara ganti aset final
1. Ubah copy produk, CTA, state, dan FAQ di `src/config/content.js`.
2. Overwrite file poster preview dan marker guide dengan desain final.
3. Generate marker pattern final lalu overwrite `public/assets/markers/custom-marker-placeholder.patt`.
4. Jika sudah punya model `.glb`, ganti `public/assets/models/phone-demo.glb`.
5. Ubah `assetManifest.model.mode` menjadi `gltf` bila ingin memakai model final.
6. Tuning `scale`, `rotation`, `position`, dan hotspot hingga framing mobile terasa pas.

## Deploy
Project aman untuk static hosting dan sudah cocok untuk Vercel, Netlify, GitHub Pages, atau server static biasa. Tetap gunakan HTTPS untuk akses kamera.
