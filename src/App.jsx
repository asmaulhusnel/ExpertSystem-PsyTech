import { useState } from "react";
import { forwardChaining } from "./rules";

export default function App() {
  const [input, setInput] = useState("");
  const [hasil, setHasil] = useState("");

  const prosesDiagnosis = () => {
    const gejalaList = input
      .toLowerCase()
      .split(",")
      .map((g) => g.trim());

    const result = forwardChaining(gejalaList);
    setHasil(result);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: "url('/bg-psytech.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* NAVBAR */}
      <div className="w-full fixed top-0 left-0 z-30 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between text-white">
          <div className="text-lg font-semibold tracking-wide">PSYTECH</div>

          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-blue-300 transition">Beranda</a>
            <a href="#konsultasi" className="hover:text-blue-300 transition">Konsultasi</a>
            <a href="#" className="hover:text-blue-300 transition">Tentang</a>
          </div>
        </div>
      </div>

      <div className="pt-24"></div>

      {/* KONTEN UTAMA */}
      <div className="relative z-10 max-w-3xl mx-auto text-white px-6 py-10">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Sistem Pakar Diagnosa Psikologi Mahasiswa
        </h1>

        <p className="text-center mb-8 text-gray-200">
          Masukkan gejala yang Anda rasakan (pisahkan dengan koma)
        </p>

        <textarea
          className="w-full p-4 rounded-xl bg-white/20 border border-white/30 text-white placeholder-gray-200 focus:outline-none"
          rows="4"
          placeholder="contoh: cemas, sulit tidur, takut ortam"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={prosesDiagnosis}
          className="mt-5 w-full py-3 bg-blue-500 hover:bg-blue-600 transition rounded-xl font-semibold"
        >
          Diagnosa Sekarang
        </button>

        {hasil && (
          <div className="mt-6 p-5 rounded-xl bg-white/10 border border-white/30">
            <h2 className="text-xl font-bold mb-2">Hasil Diagnosis:</h2>
            <p className="text-lg">{hasil}</p>
          </div>
        )}
      </div>

      {/* FOOTER */}
      <footer className="relative z-10 text-center text-gray-300 pb-6 mt-16">
        design by: <span className="font-semibold">asmaul husnah nasrullah</span>
      </footer>
    </div>
  );
}
