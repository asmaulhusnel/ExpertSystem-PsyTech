import React from "react";

export default function Dashboard() {
  return (
    <div className="p-6 bg-yellow-100/80 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold mb-4">Selamat Datang di PsyTech</h1>
      <p className="mb-3">
        PsyTech adalah sistem pakar untuk membantu mendiagnosa masalah psikologis berdasarkan gejala yang dialami.
      </p>
      <h2 className="text-xl font-semibold mb-2">Tentang Masalah Psikologi</h2>
      <p className="mb-2">
        Masalah psikologis dapat berupa kecemasan, stres, depresi, dan gangguan perilaku lainnya. 
        Sistem ini membantu memberikan rekomendasi awal berdasarkan gejala yang dilaporkan.
      </p>
      <p className="mb-2">
        Gunakan menu Konsultasi untuk memilih gejala dan menjalankan penalaran forward chaining untuk mendapatkan diagnosa dan confidence factor.
      </p>
    </div>
  );
}
