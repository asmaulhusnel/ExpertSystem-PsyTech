import React, { useState } from "react";
import kbSource from "./data/knowledge.json";
import bgImage from "./bg.jpg"; // impor gambar dari folder src

const clone = (v) => JSON.parse(JSON.stringify(v));

function forwardChaining(initialFacts, rules) {
  const facts = new Set(initialFacts);
  const inferred = new Set();
  const trace = [];
  const fired = new Set();

  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of rules) {
      if (fired.has(rule.id)) continue;
      const allMatch = rule.if.every((prem) => facts.has(prem));
      if (allMatch) {
        const conclusionId = rule.then.id;
        if (!facts.has(conclusionId)) {
          facts.add(conclusionId);
          inferred.add(conclusionId);
          changed = true;
        }
        fired.add(rule.id);
        trace.push({
          ruleId: rule.id,
          fired: true,
          matched: rule.if.slice(),
          conclusion: rule.then,
          confidence: rule.confidence ?? 1,
        });
      } else {
        trace.push({
          ruleId: rule.id,
          fired: false,
          matched: rule.if.filter((p) => facts.has(p)),
          needed: rule.if.length,
          confidence: rule.confidence ?? 0,
        });
      }
    }
  }

  const diagnoses = [];
  for (const rule of rules) {
    if (fired.has(rule.id) && rule.then.id.startsWith("d_")) {
      diagnoses.push({
        ruleId: rule.id,
        diagnosisId: rule.then.id,
        diagnosisText: rule.then.text,
        confidence: rule.confidence ?? 1,
      });
    }
  }

  return {
    facts: Array.from(facts),
    inferred: Array.from(inferred),
    diagnoses,
    trace,
  };
}

export default function App() {
  const [kb, setKb] = useState(() => clone(kbSource));
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [page, setPage] = useState("dashboard");

  const [newSymptomText, setNewSymptomText] = useState("");

  function toggleSymptom(id) {
    setSelectedSymptoms((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  function runInference() {
    const initialFacts = selectedSymptoms.slice();
    const out = forwardChaining(initialFacts, kb.rules);
    setResult(out);
  }

  function reset() {
    setSelectedSymptoms([]);
    setResult(null);
  }

  function addSymptom(e) {
    e.preventDefault();
    if (!newSymptomText.trim()) return alert("Masukkan teks gejala.");
    const id = "s" + (kb.symptoms.length + 1 + Math.floor(Math.random() * 1000));
    const newSym = { id, text: newSymptomText.trim() };
    setKb((k) => ({ ...k, symptoms: [...k.symptoms, newSym] }));
    setNewSymptomText("");
    alert("Gejala berhasil ditambahkan (disimpan sementara).");
  }

  const symptomMap = {};
  kb.symptoms.forEach((s) => (symptomMap[s.id] = s.text));

  return (
    <div
      className="min-h-screen relative bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-20 bg-black/80 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold tracking-wide">PsyTech</div>
          <div className="flex space-x-6 text-sm">
            <button onClick={() => setPage("dashboard")} className="hover:text-yellow-400 transition">Dashboar</button>
            <button onClick={() => setPage("konsultasi")} className="hover:text-yellow-400 transition">Konsultasi</button>
            <button onClick={() => setPage("tambah-gejala")} className="hover:text-yellow-400 transition">Tambah Gejala</button>
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-6xl mx-auto px-6 relative z-10">
        {/* Dashboard Page */}
        {page === "dashboard" && (
          <section>
            <h1 className="text-4xl font-bold mb-4 text-yellow-300">Aplikasi Pakar</h1>
            <p className="mb-4 text-gray-300">
             Selamat Datang — Diagnosa Masalah Psikologis Anda!
            </p>

            {/* Penjelasan Masalah Psikologis */}
            <div className="mb-6 p-4 bg-gray-900/50 rounded border border-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Tentang Masalah Psikologis</h2>
              <p className="mb-2">
                Masalah psikologis adalah kondisi di mana seseorang mengalami gangguan pada kesehatan mental, emosional, atau perilakunya, sehingga memengaruhi cara berpikir, merasakan, dan berinteraksi dengan orang lain. Masalah ini bisa muncul karena berbagai faktor, seperti tekanan hidup, konflik interpersonal, trauma, atau ketidakseimbangan kimiawi dalam otak.
              </p>
              <p className="mb-2">Beberapa contoh masalah psikologis yang umum terjadi antara lain:</p>
              <ul className="list-disc pl-5 mb-2">
                <li>Stres dan kecemasan: perasaan tegang, cemas berlebihan, atau khawatir terus-menerus.</li>
                <li>Depresi: perasaan sedih, putus asa, dan kehilangan minat terhadap aktivitas sehari-hari.</li>
                <li>Gangguan tidur: sulit tidur, sering terbangun, atau tidur berlebihan.</li>
                <li>Kesulitan sosial: merasa takut atau canggung dalam berinteraksi dengan orang lain.</li>
              </ul>
            </div>

            {/* Penjelasan tentang aplikasi PsyTech */}
            <div className="mb-6 p-4 bg-gray-900/50 rounded border border-gray-700">
              <h2 className="text-2xl font-semibold mb-2 text-yellow-400">Tentang Aplikasi PsyTech</h2>
              <p>
                PsyTech adalah aplikasi sistem pakar yang membantu pengguna mendiagnosa masalah psikologis berdasarkan gejala yang dialami. Aplikasi ini menggunakan metode forward chaining untuk mengolah data gejala dan menghasilkan diagnosa dengan tingkat keyakinan tertentu. 
              </p>
              <ul className="list-disc pl-5 mb-2">
                <li>Memahami jenis masalah psikologis yang mungkin dialami.</li>
                <li>Mendapatkan gambaran awal mengenai gejala dan diagnosa yang sesuai.</li>
                <li>Mendukung langkah selanjutnya, seperti konsultasi dengan psikolog profesional.</li>
              </ul>
            </div>
          </section>
        )}

        {/* Konsultasi Page */}
        {page === "konsultasi" && (
          <section id="konsultasi">
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">
              Konsultasi Masalah Psikologis
            </h2>
            <p className="mb-4 text-yellow-400">
              Petunjuk: Pilih gejala yang sesuai dengan kondisi Anda, kemudian tekan tombol Diagnosa untuk melihat hasil.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Select Symptoms */}
              <div className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700 shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Pilih Gejala</h3>
                <div className="space-y-2 max-h-64 overflow-auto pr-2">
                  {kb.symptoms.map((s) => (
                    <label key={s.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedSymptoms.includes(s.id)}
                        onChange={() => toggleSymptom(s.id)}
                        className="accent-yellow-400"
                      />
                      <span>{s.text}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={runInference}
                    className="px-4 py-2 bg-yellow-400 rounded text-black hover:bg-yellow-500 transition"
                  >
                    Diagnosa
                  </button>
                  <button
                    onClick={reset}
                    className="px-4 py-2 bg-gray-300 rounded text-black hover:bg-gray-400 transition"
                  >
                    Reset
                  </button>
                </div>
              </div>

              {/* Right - Results */}
              <div className="p-6 rounded-2xl bg-gray-800/70 border border-gray-700 shadow-lg max-h-[600px] overflow-auto">
                <h3 className="text-xl font-semibold mb-4">Hasil Diagnosis</h3>
                {!result && <p>Pilih gejala dan klik Diagnosa.</p>}
                {result && (
                  <>
                    <div className="mb-3">
                      <strong>Fakta Akhir:</strong>
                      <ul className="list-disc pl-5">
                        {result.facts.map((f, i) => (
                          <li key={i}>{symptomMap[f] || f}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-3">
                      <strong>Diagnosa + Confidence:</strong>
                      <ul className="list-disc pl-5">
                        {result.diagnoses.length === 0 ? (
                          <li>Tidak ada diagnosa yang cocok.</li>
                        ) : (
                          result.diagnoses.map((d, i) => (
                            <li key={i}>
                              {d.diagnosisText} — CF: {Math.round(d.confidence * 100)}%
                            </li>
                          ))
                        )}
                      </ul>
                    </div>

                    <div>
                      <strong>Trace:</strong>
                      <div className="text-xs max-h-36 overflow-auto bg-gray-900/50 p-2 rounded mt-1">
                        {result.trace.map((t, i) => (
                          <div key={i} className="mb-2">
                            <div>Rule: {t.ruleId} — Fired: {t.fired ? "Ya" : "Tidak"}</div>
                            <div>Matched: {t.matched.join(", ") || "-"}</div>
                            {t.conclusion && (
                              <div>
                                Then: {t.conclusion.text} — CF: {t.confidence * 100}%
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Tambah Gejala Page */}
        {page === "tambah-gejala" && (
          <section>
            <h2 className="text-3xl font-bold mb-4 text-yellow-300">Tambah Gejala Baru</h2>
            <form onSubmit={addSymptom} className="p-6 bg-gray-900/50 rounded border border-gray-700 max-w-md">
              <label className="block mb-2">Nama Gejala:</label>
              <input
                type="text"
                value={newSymptomText}
                onChange={(e) => setNewSymptomText(e.target.value)}
                placeholder="Masukkan gejala baru"
                className="w-full p-2 rounded bg-gray-800 text-white border border-gray-600 mb-4"
              />
              <button className="px-4 py-2 bg-yellow-400 rounded text-black hover:bg-yellow-500 transition">
                Tambah Gejala
              </button>
            </form>
          </section>
        )}
      </main>

      <footer className="py-4 text-center text-gray-400 text-sm bg-black/80 border-t border-gray-700">
        <p><strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech</p>
      </footer>
    </div>
  );
}
