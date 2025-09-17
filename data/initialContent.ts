import type { AboutContent, ContactContent } from '../types';

export const initialAboutContent: AboutContent = {
    title: "Tentang PSKPP",
    subtitle: "Memperkasa Sukan dalam Perkhidmatan Pendidikan.",
    features: [
        { title: 'Semangat Kesukanan', description: 'Mempromosikan gaya hidup sihat dan memupuk semangat kesukanan yang tinggi di kalangan warga pendidik.' },
        { title: 'Bakat Terpendam', description: 'Memberi peluang kepada warga pendidik untuk menunjukkan bakat terpendam mereka di dalam setiap acara sukan yang disertai.' },
    ]
};

// FIX: Add initialContactContent to fix missing export error in Contact.tsx.
export const initialContactContent: ContactContent = {
    title: "Hubungi Kami",
    subtitle: "Ada sebarang pertanyaan? Hantarkan mesej kepada kami.",
    formLabels: {
      name: "Nama Penuh",
      email: "Alamat E-mel",
      message: "Mesej Anda",
      submit: "Hantar Mesej",
    },
};
