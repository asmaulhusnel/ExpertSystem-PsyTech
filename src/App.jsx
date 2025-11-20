import React, { useState } from "react";
import kbSource from "./data/knowledge.json";
import bgImg from "./bg.jpg";

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
  const [page, setPage] = useState("dashboard"); // simple page state

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

  const symptomMap = {};
  kb.symptoms.forEach((s) => (symptomMap[s.id] = s.text));

  return (
    <div
      className="min-h-screen bg-gray-900 text-white relative"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold">PsyTech</div>
          <nav className="flex space-x-6 text-sm">
            <button
              onClick={() => setPage("dashboard")}
              className="hover:text-yellow-400 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => setPage("konsultasi")}
              className="hover:text-yellow-400 transition"
            >
              Konsultasi
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-24 max-w-6xl mx-auto px-6 relative z-10">
        {page === "dashboard" && (
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Aplikasi Pakar</h1>
            <p className="text-xl mb-6">Masalah Psikologis & Diagnosa</p>
         
            <p className="mt-6 text-gray-300 max-w-xl mx-auto">
              PsyTech adalah sistem pakar yang membantu melakukan diagnosa
              masalah psikologis berdasarkan gejala yang Anda alami. Pilih menu
              konsultasi untuk memulai proses diagnosa.
            </p>
          <p className="mt-6 text-gray-300 max-w-xl mx-auto">
            Masalah psikologis adalah kondisi di mana seseorang mengalami gangguan pada kesehatan mental, emosional, atau perilakunya, sehingga memengaruhi cara berpikir, merasakan, dan berinteraksi dengan orang lain. Masalah ini bisa muncul karena berbagai faktor, seperti tekanan hidup, konflik interpersonal, trauma, atau ketidakseimbangan kimiawi dalam otak.
Beberapa contoh masalah psikologis yang umum terjadi antara lain:
Stres dan kecemasan: perasaan tegang, cemas berlebihan, atau khawatir terus-menerus.
Depresi: perasaan sedih, putus asa, dan kehilangan minat terhadap aktivitas sehari-hari.
Gangguan tidur: sulit tidur, sering terbangun, atau tidur berlebihan.
Kesulitan sosial: merasa takut atau canggung dalam berinteraksi dengan orang lain.
Jika masalah psikologis tidak ditangani, dapat memengaruhi kesehatan fisik, produktivitas, dan kualitas hidup seseorang. Penanganannya bisa melalui konseling, terapi, perubahan gaya hidup, atau, dalam kasus tertentu, pengobatan.
          </p>
          </section>
        )}

        {page === "konsultasi" && (
          <section id="konsultasi">
            import React, { useState } from "react";
import kbSource from "./data/knowledge.json";
import bgImg from "./bg.jpg";

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
  const [page, setPage] = useState("dashboard"); // simple page state

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

  const symptomMap = {};
  kb.symptoms.forEach((s) => (symptomMap[s.id] = s.text));

  return (
    <div
      className="min-h-screen bg-gray-900 text-white relative"
      style={{
        backgroundImage: `url(${bgImg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Header */}
      <header className="fixed top-0 w-full z-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold">PsyTech</div>
          <nav className="flex space-x-6 text-sm">
            <button
              onClick={() => setPage("dashboard")}
              className="hover:text-yellow-400 transition"
            >
              Dashboard
            </button>
            <button
              onClick={() => setPage("konsultasi")}
              className="hover:text-yellow-400 transition"
            >
              Konsultasi
            </button>
          </nav>
        </div>
      </header>

      <main className="pt-24 max-w-6xl mx-auto px-6 relative z-10">
        {page === "dashboard" && (
          <section className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Aplikasi Pakar</h1>
            <p className="text-xl mb-6">Masalah Psikologis & Diagnosa</p>
            <img
              src={bgImg}
              alt="Sistem Pakar"
              className="mx-auto w-64 rounded shadow-lg"
            />
            <p className="mt-6 text-gray-300 max-w-xl mx-auto">
              PsyTech adalah sistem pakar yang membantu melakukan diagnosa
              masalah psikologis berdasarkan gejala yang Anda alami. Pilih menu
              konsultasi untuk memulai proses diagnosa.
            </p>
          </section>
        )}

        {page === "konsultasi" && (
          <section id="konsultasi">
            <h2 className="text-3xl font-bold mb-4">
              Konsultasi Masalah Psikologis
            </h2>
            <p className="mb-4 text-yellow-300">
              Petunjuk: Pilih gejala yang sesuai dengan kondisi Anda, kemudian
              tekan tombol Diagnosa untuk melihat hasil.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Select Symptoms */}
              <div className="p-6 rounded-2xl bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-lg">
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
              <div className="p-6 rounded-2xl bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-lg max-h-[600px] overflow-auto">
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
                              {d.diagnosisText} — CF:{" "}
                              {Math.round(d.confidence * 100)}%
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
                            <div>
                              Rule: {t.ruleId} — Fired: {t.fired ? "Ya" : "Tidak"}
                            </div>
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
      </main>

      {/* Footer */}
      <footer className="mt-12 py-4 text-center text-gray-300 text-sm backdrop-blur-md bg-gray-900/70 border-t border-gray-700">
        <p>
          Design by: <strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech
        </p>
      </footer>
    </div>
  );
}

            <p className="mb-4 text-yellow-300">
              Petunjuk: Pilih gejala yang sesuai dengan kondisi Anda, kemudian
              tekan tombol Diagnosa untuk melihat hasil.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Left - Select Symptoms */}
              <div className="p-6 rounded-2xl bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-lg">
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
              <div className="p-6 rounded-2xl bg-gray-800/70 backdrop-blur-md border border-gray-700 shadow-lg max-h-[600px] overflow-auto">
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
                              {d.diagnosisText} — CF:{" "}
                              {Math.round(d.confidence * 100)}%
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
                            <div>
                              Rule: {t.ruleId} — Fired: {t.fired ? "Ya" : "Tidak"}
                            </div>
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
      </main>

      {/* Footer */}
      <footer className="mt-12 py-4 text-center text-gray-300 text-sm backdrop-blur-md bg-gray-900/70 border-t border-gray-700">
        <p>
          Design by: <strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech
        </p>
      </footer>
    </div>
  );
}
