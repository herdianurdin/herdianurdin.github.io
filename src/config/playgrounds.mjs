/**
 * Registry of browser-based learning tools. Add future playgrounds here;
 * the localized directory pages render this catalog without new navigation code.
 */
export const playgroundCatalog = [
  {
    id: "python",
    title: {
      id: "Python Playground",
      en: "Python Playground",
    },
    description: {
      id: "Tempat berlatih Python langsung di browser dengan editor kode, dukungan beberapa modul, dan terminal interaktif.",
      en: "Practice Python directly in the browser with a code editor, multi-module support, and an interactive terminal.",
    },
    href: "/python-playground/",
    status: "available",
    category: {
      id: "Pemrograman",
      en: "Programming",
    },
    technologies: ["Python", "CodeMirror", "Skulpt"],
    interfaceLanguage: {
      id: "Antarmuka: Bahasa Indonesia",
      en: "Interface: Indonesian",
    },
    cta: {
      id: "Buka Playground",
      en: "Open Playground",
    },
  },
];
