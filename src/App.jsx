import React, { useState } from "react";
import bgImage from "./bg.jpg";
import logoImage from "./logo.png";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [helpOpen, setHelpOpen] = useState(false);

  // --- Render Splash Page ---
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <img src={logoImage} alt="Logo" className="w-32 h-32 rounded-full mb-4" />
        <h1 className="text-2xl font-bold text-yellow-300 mb-2">Diagnosa Masalah Psikologi</h1>
        <p className="text-gray-300 text-center max-w-xs mb-6">
          Selamat datang di <strong>PsyTech</strong>, aplikasi pakar berbasis web untuk mendiagnosa kondisi psikologis.
        </p>
        <button
          className="px-6 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
          onClick={() => setShowSplash(false)}
        >
          Mulai
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-20 bg-black/80 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold tracking-wide">PsyTech</div>
          <div className="flex space-x-6 text-sm">
            <button onClick={() => setPage("dashboard")} className="hover:text-yellow-400 transition">Dashboard</button>
            <button onClick={() => setPage("konsultasi")} className="hover:text-yellow-400 transition">Konsultasi</button>
            <button onClick={() => setPage("knowledge-base")} className="hover:text-yellow-400 transition">Knowledge Base</button>
            <button onClick={() => setHelpOpen(true)} className="hover:text-yellow-400 transition">Bantuan</button>
          </div>
        </div>
      </header>

      {/* Modal Bantuan */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full text-white relative">
            <button
              onClick={() => setHelpOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Bantuan & Kontak</h2>
            <p className="mb-2">Pengembang: <strong>Asmaul Husnah Nasrullah</strong></p>
            <p className="mb-2">Email: <a href="mailto:Asmaul.husnah@unm.ac.id" className="text-yellow-300 underline">Asmaul.husnah@unm.ac.id</a></p>
            <p className="mb-2">Kontak: 0821-9353-3471</p>
            <p className="mt-4">
              Jika Anda ingin mengembangkan aplikasi ini menggunakan metode inferensi lain, silakan menghubungi kontak di atas.
            </p>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="pt-24 max-w-6xl mx-auto px-6 relative z-10">
        {page === "dashboard" && (
          <div className="text-white">
            <h1 className="text-4xl font-bold text-yellow-300 mb-4">Dashboard</h1>
            <p className="text-gray-300">Ini adalah halaman Dashboard sementara.</p>
          </div>
        )}
        {page === "konsultasi" && (
          <div className="text-white">
            <h1 className="text-4xl font-bold text-yellow-300 mb-4">Konsultasi</h1>
            <p className="text-gray-300">Ini adalah halaman Konsultasi sementara.</p>
          </div>
        )}
        {page === "knowledge-base" && (
          <div className="text-white">
            <h1 className="text-4xl font-bold text-yellow-300 mb-4">Knowledge Base</h1>
            <p className="text-gray-300">Ini adalah halaman Knowledge Base sementara.</p>
          </div>
        )}
      </main>

      <footer className="py-4 text-center text-gray-400 text-sm bg-black/80 border-t border-gray-700">
        <p><strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech</p>
      </footer>
    </div>
  );
}
