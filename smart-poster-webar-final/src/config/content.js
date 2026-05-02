const base = import.meta.env.BASE_URL || '/';

const withBase = (path) => `${base}${path.replace(/^\//, '')}`;

export const appConfig = {
  appName: 'Nova X Vision Smart Poster AR',
  appEyebrow: 'Smart Poster + WebAR + AI FAQ',
  demoMode: false,
  support: {
    recommendedBrowsers: 'Chrome Android terbaru atau Safari iPhone terbaru',
    secureContextHint: 'Gunakan HTTPS atau localhost agar browser mengizinkan akses kamera.',
    mobileHint: 'Pegang ponsel vertikal, dekatkan ke poster, dan jaga marker tetap terang serta tidak tertutup.',
    markerHint: 'Jika tracking goyang, mundurkan kamera sedikit lalu posisikan ulang sampai seluruh marker masuk frame.',
  },
};

export const productContent = {
  productName: 'Nova X Vision 5G',
  tagline:
    'Poster smartphone yang tadinya statis berubah menjadi pengalaman AR interaktif lengkap dengan penjelasan fitur dan asisten FAQ penjualan.',
  shortSpecs: [
    'Kamera 200MP Ultra Detail + AI Night Portrait',
    'Layar AMOLED 6.78 inci 144Hz HDR',
    'Chipset 5G flagship + RAM 12GB',
    'Baterai 5200mAh dengan 100W Hyper Charge',
  ],
  cta: {
    label: 'Lihat Penawaran Produk',
    url: 'https://example.com/nova-x-vision-5g',
    contextLabel: 'CTA Penjualan Smartphone',
  },
  instruction: {
    title: 'Scan smart poster untuk memunculkan smartphone dalam AR',
    body:
      'Masuk ke mode AR, izinkan kamera, lalu arahkan kamera ke area marker pada poster sampai model smartphone muncul stabil di atas poster.',
    checklist: [
      'Buka halaman melalui HTTPS atau localhost.',
      'Pastikan seluruh marker poster terlihat penuh dan cukup terang.',
      'Tap hotspot untuk melihat keunggulan kamera, layar, performa, dan baterai.',
      'Gunakan chatbot untuk menjawab pertanyaan calon pembeli secara instan.',
    ],
  },
  states: {
    idle: 'Tekan tombol untuk memulai demo smart poster berbasis WebAR.',
    loading: 'Meminta izin kamera dan menyiapkan scene AR…',
    cameraGranted: 'Izin kamera diberikan. Arahkan kamera ke marker poster sekarang.',
    cameraDenied: 'Izin kamera ditolak. Muat ulang halaman lalu izinkan akses kamera untuk mencoba lagi.',
    markerSearching: 'Kamera aktif. Cari area marker pada poster dan jaga marker terlihat utuh.',
    markerFound: 'Marker terkunci. Smartphone AR aktif dan siap dieksplorasi.',
    markerLost: 'Marker keluar dari frame. Arahkan kembali kamera ke poster untuk memunculkan produk lagi.',
    modelFailed: 'Model final belum tersedia atau gagal dimuat. Sistem memakai mockup procedural agar demo tetap berjalan.',
    incompatible: 'Perangkat ini belum ideal untuk demo WebAR. Gunakan browser mobile terbaru dengan akses kamera aktif.',
    arReady: 'Scene AR siap. Posisikan kamera pada poster untuk mulai presentasi produk.',
  },
  fallbackMessage:
    'Fallback akan tetap menjaga demo berjalan walau model 3D final belum siap, sehingga pengalaman presentasi tidak terhenti.',
  hotspots: [
    {
      id: 'camera',
      label: 'Kamera',
      title: '200MP Ultra Detail Camera',
      summary:
        'Dirancang untuk foto produk, portrait malam, dan konten media sosial dengan detail tinggi dan stabilisasi berbasis AI.',
    },
    {
      id: 'display',
      label: 'Layar',
      title: 'AMOLED 144Hz HDR Display',
      summary:
        'Memberikan pengalaman visual premium dengan warna tajam, gerak mulus, dan tingkat kecerahan tinggi untuk gaming serta streaming.',
    },
    {
      id: 'performance',
      label: 'Performa',
      title: 'Flagship 5G Performance',
      summary:
        'Kombinasi chipset kencang, RAM besar, dan optimasi termal untuk multitasking, editing konten, dan penggunaan berat seharian.',
    },
    {
      id: 'battery',
      label: 'Baterai',
      title: '5200mAh + 100W Hyper Charge',
      summary:
        'Tahan lama untuk aktivitas mobile dan dapat diisi cepat agar pengguna tidak terganggu saat bekerja atau bepergian.',
    },
  ],
};

export const chatbotContent = {
  personaName: 'NOVA Sales Assistant',
  title: 'AI FAQ Penjualan',
  subtitle: 'Asisten cepat untuk calon pembeli poster interaktif',
  greeting:
    'Halo! Saya siap membantu menjelaskan fitur Nova X Vision 5G, promo demo, dan cara membeli produk.',
  emptyState: 'Pilih pertanyaan cepat atau ketik pertanyaan Anda sendiri.',
  inputPlaceholder: 'Tanya soal kamera, harga, promo, baterai, atau cara beli…',
  sendLabel: 'Kirim',
  quickQuestions: [
    'Berapa perkiraan harga produk ini?',
    'Apa keunggulan kameranya?',
    'Ada promo atau bonus pembelian?',
    'Bagaimana cara membeli setelah scan poster?',
  ],
  escalation: {
    label: 'Buka halaman penawaran',
    url: 'https://example.com/nova-x-vision-5g',
  },
  fallbackResponse:
    'Saya belum punya jawaban spesifik untuk itu. Coba tanya soal harga, kamera, layar, performa, baterai, promo, atau cara membeli.',
  faq: [
    {
      id: 'price',
      intents: ['harga', 'price', 'berapa', 'biaya'],
      question: 'Berapa perkiraan harga produk ini?',
      answer:
        'Untuk kebutuhan demo, Nova X Vision 5G diposisikan sebagai smartphone flagship dengan estimasi harga mulai dari Rp9.999.000, tergantung varian memori dan promo toko.',
    },
    {
      id: 'camera',
      intents: ['kamera', 'foto', 'video', '200mp', 'night'],
      question: 'Apa keunggulan kameranya?',
      answer:
        'Keunggulan utama ada pada kamera 200MP, AI Night Portrait, dan stabilisasi cerdas sehingga cocok untuk foto detail, konten harian, dan low-light.',
    },
    {
      id: 'display',
      intents: ['layar', 'screen', 'amoled', '144hz', 'display'],
      question: 'Bagaimana kualitas layarnya?',
      answer:
        'Layarnya AMOLED 6.78 inci 144Hz HDR, jadi unggul untuk visual cerah, scrolling halus, gaming kompetitif, dan menonton video premium.',
    },
    {
      id: 'performance',
      intents: ['performa', 'chipset', 'ram', 'gaming', '5g'],
      question: 'Seberapa kuat performanya?',
      answer:
        'Perangkat ini disusun sebagai flagship 5G dengan RAM 12GB, jadi cocok untuk multitasking berat, mobile gaming, editing konten, dan produktivitas cepat.',
    },
    {
      id: 'battery',
      intents: ['baterai', 'battery', 'charge', 'charging', '5200'],
      question: 'Bagaimana baterai dan charging-nya?',
      answer:
        'Baterai 5200mAh dirancang untuk penggunaan intens seharian, dan 100W Hyper Charge membantu pengisian ulang jauh lebih cepat saat mobilitas tinggi.',
    },
    {
      id: 'promo',
      intents: ['promo', 'bonus', 'diskon', 'hadiah', 'preorder'],
      question: 'Ada promo atau bonus pembelian?',
      answer:
        'Untuk skenario kampanye, promo yang ditampilkan bisa berupa bonus TWS, cashback marketplace, cicilan 0%, atau kuota data bundling saat periode launching.',
    },
    {
      id: 'buy',
      intents: ['beli', 'buy', 'marketplace', 'checkout', 'pesan'],
      question: 'Bagaimana cara membeli setelah scan poster?',
      answer:
        'Setelah eksplorasi AR selesai, pengguna tinggal menekan tombol CTA “Lihat Penawaran Produk” untuk diarahkan ke halaman penjualan atau marketplace resmi.',
    },
  ],
};

export const assetManifest = {
  poster: {
    preview: withBase('/assets/poster/poster-preview.svg'),
    markerGuide: withBase('/assets/poster/poster-marker-guide.svg'),
  },
  branding: {
    thumb: withBase('/assets/branding/brand-thumb.svg'),
  },
  marker: {
    mode: 'pattern',
    devFallbackMode: 'preset-hiro',
    patternUrl: withBase('/assets/markers/custom-marker-placeholder.patt'),
    preview: withBase('/assets/markers/custom-marker-reference.svg'),
    hiroPreview: withBase('/assets/markers/marker-hiro-reference.svg'),
  },
  model: {
    mode: 'procedural',
    fallbackMode: 'procedural',
    src: withBase('/assets/models/phone-demo.glb'),
    scale: '0.76 0.76 0.76',
    rotation: '-90 0 0',
    position: '0 0.88 0',
    fallbackPosition: '0 0.88 0',
  },
};
