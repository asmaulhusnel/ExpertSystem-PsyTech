import React, { useState } from "react";
import { knowledgeBase, forwardChaining } from "./rules";

export default function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  // Semua gejala unik
  const symptoms = [...new Set(knowledgeBase.flatMap(rule => rule.kondisi))];

  const toggleSymptom = (s) => {
    setSelectedSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const runDiagnosis = () => {
    const res = forwardChaining(selectedSymptoms, knowledgeBase);
    setResult(res);
  };

  const reset = () => {
    setSelectedSymptoms([]);
    setResult(null);
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('/bg-psytech.jpg')" }}
    >
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>

      {/* Navbar */}
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

      <div className="pt-24 max-w-5xl mx-auto px-6 relative z-10 text-white">
        <h1 className="text-4xl font-bold mb-6 text-center">Diagnosa Psikologis Mahasiswa</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Kiri: Input Gejala */}
          <div className="p-6 rounded-xl bg-white/20 backdrop-blur border border-white/30">
            <h2 className="text-xl font-semibold mb-4">Pilih Gejala</h2>
            <div className="space-y-2 max-h-64 overflow-auto pr-2">
              {symptoms.map(s => (
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
              <button onClick={runDiagnosis} className="px-4 py-2 bg-blue-600 rounded text-white">Diagnosa</button>
              <button onClick={reset} className="px-4 py-2 bg-gray-300 rounded">Reset</button>
            </div>
          </div>

          {/* Kanan: Hasil + CF + Trace */}
          <div className="p-6 rounded-xl bg-white/20 backdrop-blur border border-white/30 max-h-[500px] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Hasil Diagnosis</h2>

            {!result && <p>Pilih gejala dan klik Diagnosa.</p>}

            {result && (
              <>
                <div className="mb-3">
                  <strong>Fakta Akhir (Gejala Terpilih):</strong>
                  <ul className="list-disc pl-5">
                    {result.facts.map((f,i) => <li key={i}>{f}</li>)}
                  </ul>
                </div>

                <div className="mb-3">
                  <strong>Diagnosa + CF:</strong>
                  <ul className="list-disc pl-5">
                    {result.diagnoses.length === 0 ? (
                      <li>Tidak ada diagnosa yang cocok.</li>
                    ) : (
                      result.diagnoses.map((d,i) => <li key={i}>{d.hasil} — CF: {Math.round(d.cf*100)}%</li>)
                    )}
                  </ul>
                </div>

                <div>
                  <strong>Trace Forward Chaining:</strong>
                  <div className="text-xs max-h-36 overflow-auto bg-white/10 p-2 rounded mt-1">
                    {result.trace.map((t,i) => (
                      <div key={i} className="mb-2">
                        <div>Rule: {t.ruleId} — Fired: {t.fired ? "Ya" : "Tidak"}</div>
                        <div>Matched: {t.matched.join(", ") || "-"}</div>
                        {t.conclusion && <div>Then: {t.conclusion} — CF: {t.cf*100}%</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-white/80 text-xs mt-6">
          <strong>Asmaul Husnah Nasrullah</strong>
        </div>
      </div>
    </div>
  );
}
