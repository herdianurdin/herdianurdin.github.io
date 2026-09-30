// src/config/site.ts

// 1. Data Universal (Tidak terpengaruh bahasa)
export const siteConfig = {
  author: "Herdi Herdianurdin",
  url: "https://herdianurdin.my.id",
  github: "https://github.com/herdianurdin",
  linkedin: "https://www.linkedin.com/in/herdianurdin",
  playStore:
    "https://play.google.com/store/apps/developer?id=Herdi+Herdianurdin",
  profileImage: "/images/profile.webp",
  giscus: {
    repo: "herdianurdin/herdianurdin.github.io",
    repoId: "R_kgDOHl0njQ",
    category: "Announcements",
    categoryId: "DIC_kwDOHl0njc4DGOzd",
  },
  logoText: "HERDIANURDIN",
  logoHighlight: ".MY.ID",
  errorBadge: "Critical System Error",
  errorException: "> java.lang.NullPointerException",
  maxPosts: 4,
  googleAdsenseId: "",
};

// 2. Data Spesifik Bahasa (i18n)
export const siteTranslation = {
  id: {
    siteTitle: "Jurnal IT & Arsitektur Kode",
    siteDescription:
      "Portofolio dan catatan teknis seputar rekayasa perangkat lunak, pengembangan Android, dan arsitektur kode.",
    heroGreeting: "Halo, saya Herdi.",
    latestJournal: "Jurnal Terbaru",
    openArchive: "Buka Arsip Jurnal Lengkap ->",
    ariaOpenArchive: "Buka arsip jurnal lengkap bahasa Indonesia",
    writtenBy: "Oleh",
    readArticle: "Baca Artikel ->",
    heroTitle: "Professional Android Developer", // Anda bisa mengubahnya menjadi bahasa Indonesia jika mau
    heroBio:
      "Pengembang perangkat lunak independen yang membangun ekosistem aplikasi Android native berskala produksi. Berfokus pada arsitektur Kotlin berkinerja tinggi, manajemen memori (Room DB), dan optimasi monetisasi (AdMob).",
    whoami: "/ WHOAMI",
    authorTitle: "Tentang Penulis",
    authorBio:
      "Herdi Herdianurdin adalah seorang pengembang perangkat lunak profesional. Berfokus pada perancangan ekosistem Android native (Kotlin), optimasi memori, dan arsitektur web berkinerja tinggi.",
    profileBtn: "Lihat Profil & Portofolio ->",
    ariaProfileBtn:
      "Kembali ke halaman utama untuk melihat portofolio lengkap Herdi",
    discussionTitle: "Diskusi & Komentar",
    portfolioTitle: "Aplikasi Play Store",
    githubBtnDesktop: "GitHub Repositories ->",
    githubBtnMobile: "Lihat GitHub Repositories ->",
    playstoreBtn: "Buka di Play Store",
    portfolioApps: [
      {
        title: "Asmaul Husna Arti dan Makna",
        tags: ["Android", "Edukasi"],
        desc: "Aplikasi edukasi audio dan visual untuk memfasilitasi pembelajaran 99 Nama Allah.",
        link: "https://play.google.com/store/apps/details?id=audio_dakwah.asmaul_husna_99.audio_belajar_asmaul_husna",
      },
      {
        title: "Bimbel & Simulasi CAT CPNS",
        tags: ["Android", "Simulasi CAT"],
        desc: "Platform simulasi Computer Assisted Test (CAT) mandiri untuk persiapan seleksi Aparatur Sipil Negara.",
        link: "https://play.google.com/store/apps/details?id=tescpnsasn.simulasicatcpns.bimbelcpnsjadiasn",
      },
      {
        title: "Tes Potensi Akademik (TPA) Pro",
        tags: ["Android", "Psikotes"],
        desc: "Modul pengujian kompetensi akademik komprehensif berstandar Bappenas untuk persiapan ujian masuk dan seleksi kerja.",
        link: "https://play.google.com/store/apps/details?id=psikotes.tespotensiakademikbappenas.ujiantpa",
      },
    ],
    privacyPolicy: "Kebijakan Privasi",
    backToHome: "Kembali ke Beranda",
    switchId: "Ganti bahasa ke Indonesia",
    switchEn: "Ganti bahasa ke Inggris",
    notFoundTitle: "Tidak Ditemukan",
    errorLogLabel: "[ID] Log Galat:",
    errorLogMsg:
      "URL yang diminta tidak ditemukan di peladen ini. Referensi memori mungkin telah dihapus, dipindahkan, atau salah ketik.",
    btnBack: "Kembali",
    btnHome: "Beranda",
    archiveTitle: "Arsip Jurnal",
    archiveDesc:
      "Kumpulan lengkap jurnal teknis, eksplorasi arsitektur, dan rekayasa perangkat lunak.",
    pageText: "Halaman",
    ofText: "dari",
    shortPageText: "Hal",
    prevPage: "Sebelumnya",
    nextPage: "Selanjutnya",
    ariaPrev: "Ke halaman sebelumnya",
    ariaNext: "Ke halaman selanjutnya",
    privacyDesc:
      "Dokumen kebijakan privasi dan pengumpulan data untuk situs web ",
    emptyPostTitle: "Papan Tulis Masih Bersih",
    emptyPostMessage:
      "Belum ada jurnal yang diterbitkan saat ini. Saya masih menyeduh kopi dan menyiapkan artikel yang menarik untuk Anda!",
    emptyArchiveTitle: "Arsip Kosong",
    emptyArchiveMessage: "Tidak ada artikel yang ditemukan di halaman ini.",
  },
  en: {
    siteTitle: "IT Journal & Code Architecture",
    siteDescription:
      "Portfolio and technical notes on software engineering, Android development, and code architecture.",
    heroGreeting: "Hi, I'm Herdi.",
    latestJournal: "Latest Journals",
    openArchive: "Open Full Journal Archive ->",
    ariaOpenArchive: "Open full English journal archive",
    writtenBy: "By",
    readArticle: "Read Article ->",
    heroTitle: "Professional Android Developer",
    heroBio:
      "Independent software engineer building production-scale native Android applications. Focused on high-performance Kotlin architectures, memory management (Room DB), and monetization optimization (AdMob).",
    whoami: "/ WHOAMI",
    authorTitle: "About the Author",
    authorBio:
      "Herdi Herdianurdin is a professional software engineer focusing on the native Android ecosystem (Kotlin), memory optimization, and high-performance web architecture.",
    profileBtn: "View Profile & Portfolio ->",
    ariaProfileBtn: "Return to homepage to view Herdi's full portfolio",
    discussionTitle: "Discussions & Comments",
    portfolioTitle: "Play Store Applications",
    githubBtnDesktop: "GitHub Repositories ->",
    githubBtnMobile: "View GitHub Repositories ->",
    playstoreBtn: "View on Play Store",
    portfolioApps: [
      {
        title: "Asmaul Husna Arti dan Makna",
        tags: ["Android", "Education"],
        desc: "Audio and visual educational application to facilitate the learning of the 99 Names of Allah.",
        link: "https://play.google.com/store/apps/details?id=audio_dakwah.asmaul_husna_99.audio_belajar_asmaul_husna",
      },
      {
        title: "Bimbel & Simulasi CAT CPNS",
        tags: ["Android", "CAT Simulation"],
        desc: "Independent Computer Assisted Test (CAT) simulation platform for civil servant selection preparation.",
        link: "https://play.google.com/store/apps/details?id=tescpnsasn.simulasicatcpns.bimbelcpnsjadiasn",
      },
      {
        title: "Tes Potensi Akademik (TPA) Pro",
        tags: ["Android", "Psychometric Test"],
        desc: "Comprehensive Bappenas-standard academic competency testing module for entrance exams and job selections.",
        link: "https://play.google.com/store/apps/details?id=psikotes.tespotensiakademikbappenas.ujiantpa",
      },
    ],
    privacyPolicy: "Privacy Policy",
    backToHome: "Back to Home",
    switchId: "Switch language to Indonesian",
    switchEn: "Switch language to English",
    notFoundTitle: "Page Not Found",
    errorLogLabel: "[EN] Error Log:",
    errorLogMsg:
      "The requested URL was not found on this server. The memory reference might have been deleted, moved, or misspelled.",
    btnBack: "Go Back",
    btnHome: "Basecamp",
    archiveTitle: "Journal Archive",
    archiveDesc:
      "A complete collection of technical journals, architectural explorations, and software engineering.",
    pageText: "Page",
    ofText: "of",
    shortPageText: "Page",
    prevPage: "Previous",
    nextPage: "Next",
    ariaPrev: "Go to previous page",
    ariaNext: "Go to next page",
    privacyDesc: "Privacy policy and data collection document for the website ",
    emptyPostTitle: "The Whiteboard Is Still Clean",
    emptyPostMessage:
      "No journals have been published yet. I am still brewing coffee and preparing an interesting article for you!",
    emptyArchiveTitle: "Empty Archive",
    emptyArchiveMessage: "No articles were found on this page.",
  },
} as const; // 'as const' mengunci tipe data agar TypeScript mengenali propertinya secara absolut
