export const knowledgeBase = [
  {
    kondisi: ["cemas", "takut ortam", "sulit tidur"],
    hasil: "Gangguan Kecemasan Umum (GAD)"
  },
  {
    kondisi: ["sedih berkepanjangan", "tidak bersemangat", "sulit fokus"],
    hasil: "Depresi Ringan"
  },
  {
    kondisi: ["mudah marah", "gelisah", "tekanan akademik"],
    hasil: "Stress Akademik Tinggi"
  },
  {
    kondisi: ["menarik diri", "tidak ingin bersosialisasi", "lelah secara emosional"],
    hasil: "Burnout / Kelelahan Emosional"
  }
];

export function forwardChaining(gejala) {
  for (const rule of knowledgeBase) {
    const cocok = rule.kondisi.every(k => gejala.includes(k));
    if (cocok) return rule.hasil;
  }
  return "Tidak ditemukan kecocokan masalah psikologi.";
}
