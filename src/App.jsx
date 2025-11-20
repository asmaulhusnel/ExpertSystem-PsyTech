import React, { useState } from "react";
import { knowledgeBase, forwardChaining } from "./rules";

export default function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState("");

  const symptoms = [
    ...new Set(knowledgeBase.flatMap((rule) => rule.kondisi)),
  ];

  const toggleSymptom = (s) => {
    setSelectedSymptoms((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]
    );
  };

  const runDiagnosis = () => {
    const res = forwardChaining(selectedSymptoms);
    setResult(res);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult("");
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg-psytech.jpg')" }}
    >
      {/* overlay */}
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

      <div className="pt-24 max-w-3xl mx-auto px-6 relative z-10 text-white">
        <h1 className="text-4xl font-bold mb-4 text-center">
          Diagnosa Psikologis Mahasiswa
        </h1>
        <p className="text-center mb-6 text-gray-200">
          Pilih gejala yang Anda rasakan:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {symptoms.map((s) => (
            <label key={s} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(s)}
                onChange={() => toggleSymptom(s)}
              />
              <span>{s}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-2 mt-4">
          <button
            onClick={runDiagnosis}
            className="px-4 py-2 bg-blue-600 rounded text-white"
          >
            Diagnosa
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Reset
          </button>
        </div>

        {result && (
          <div className="mt-6 p-4 bg-white/10 rounded border border-white/20">
            <h2 className="font-bold text-lg mb-2">Hasil Diagnosis:</h2>
            <p>{result}</p>
          </div>
        )}

        {/* FOOTER */}
        <div className="absolute bottom-3 w-full text-center text-white/80 text-xs z-20">
          Design by: <strong>Asmaul Husnah Nasrullah</strong>
        </div>
      </div>
    </div>
  );
}
