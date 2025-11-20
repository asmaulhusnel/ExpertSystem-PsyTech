import React, { useState } from "react";
import kbSource from "./data/knowledge.json";

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
  const [page, setPage] = useState("dashboard"); // dashboard atau konsultasi

  const [newSymptomText, setNewSymptomText] = useState("");
  const [newRulePremises, setNewRulePremises] = useState([]);
  const [newRuleConclusionText, setNewRuleConclusionText] = useState("");
  const [newRuleConfidence, setNewRuleConfidence] = useState(0.7);

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
    setSelectedSymptoms((s) => [...s, id]);
  }

  function addRule(e) {
    e.preventDefault();
    if (newRulePremises.length === 0)
      return alert("Pilih minimal satu premis.");
    if (!newRuleConclusionText.trim())
      return alert("Masukkan teks kesimpulan.");
    const rid = "r" + (kb.rules.length + 1 + Math.floor(Math.random() * 1000));
    const diagId = "d_" + rid;
    const rule = {
      id: rid,
      if: newRulePremises.slice(),
      then: { id: diagId, text: newRuleConclusionText.trim() },
      confidence: Number(newRuleConfidence) || 0.7,
    };
    setKb((k) => ({ ...k, rules: [...k.rules, rule] }));
    setNewRulePremises([]);
    setNewRuleConclusionText("");
    setNewRuleConfidence(0.7);
    alert("Rule ditambahkan (disimpan sementara).");
  }

  function toggleNewPremise(id) {
    setNewRulePremises((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  }

  const symptomMap = {};
  kb.symptoms.forEach((s) => (symptomMap[s.id] = s.text));

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navbar */}
      <header className="bg-gray-800 sticky top-0 z-20 shadow-md">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold">PsyTech</div>
          <div className="flex space-x-6 text-sm">
            <button onClick={() => setPage("dashboard")} className="hover:underline">Dashboard</button>
            <button onClick={() => setPage("konsultasi")} className="hover:underline">Konsultasi</button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        {page === "dashboard" && (
          <div className="text-center">
            <img src="/bg-psytech.jpg" alt="Sistem Pakar" className="mx-auto mb-6 w-64 rounded" />
            <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
            <p>Selamat datang di PsyTech — Sistem Pakar Diagnosa Psikologis.</p>
            <p className="mt-2">Sistem ini membantu mendiagnosa masalah psikologi berdasarkan gejala yang dipilih. Anda dapat mempelajari gejala, rule, dan memanfaatkan sistem untuk konsultasi psikologi sederhana.</p>
          </div>
        )}

        {page === "konsultasi" && (
          <div>
            {/* Gambar Header Konsultasi */}
            <div className="mb-4 text-center">
              <img src="/bg-psytech.jpg" alt="Konsultasi" className="mx-auto w-64 rounded mb-3"/>
              <h1 className="text-2xl font-bold mb-2">Aplikasi Pakar — Diagnosa Masalah Psikologis Anda!</h1>
              <p className="text-sm text-gray-300">Pilih gejala yang sesuai dan klik Diagnosa untuk melihat hasil.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* LEFT: Konsultasi */}
              <div className="p-6 rounded-xl bg-gray-800/80 shadow-md">
                <h2 className="text-xl font-semibold mb-4">Pilih Gejala</h2>
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
                  <button onClick={runInference} className="px-4 py-2 bg-yellow-500 rounded text-black hover:bg-yellow-600 transition">
                    Diagnosa
                  </button>
                  <button onClick={reset} className="px-4 py-2 bg-gray-600 rounded hover:bg-gray-700">
                    Reset
                  </button>
                </div>
              </div>

              {/* RIGHT: Hasil */}
              <div className="p-6 rounded-xl bg-gray-800/80 shadow-md max-h-[600px] overflow-auto">
                <h2 className="text-xl font-semibold mb-4">Hasil Diagnosis</h2>
                {!result && <p>Pilih gejala dan klik Diagnosa.</p>}
                {result && (
                  <>
                    <div className="mb-3">
                      <strong>Fakta Akhir:</strong>
                      <ul className="list-disc pl-5">
                        {result.facts.map((f, i) => <li key={i}>{symptomMap[f] || f}</li>)}
                      </ul>
                    </div>
                    <div className="mb-3">
                      <strong>Diagnosa + Confidence:</strong>
                      <ul className="list-disc pl-5">
                        {result.diagnoses.length === 0 ? (
                          <li>Tidak ada diagnosa yang cocok.</li>
                        ) : (
                          result.diagnoses.map((d, i) => (
                            <li key={i}>{d.diagnosisText} — CF: {Math.round(d.confidence*100)}%</li>
                          ))
                        )}
                      </ul>
                    </div>
                    <div>
                      <strong>Trace:</strong>
                      <div className="text-xs max-h-36 overflow-auto bg-gray-700/40 p-2 rounded mt-1">
                        {result.trace.map((t,i) => (
                          <div key={i} className="mb-2">
                            <div>Rule: {t.ruleId} — Fired: {t.fired ? "Ya" : "Tidak"}</div>
                            <div>Matched: {t.matched.join(", ") || "-"}</div>
                            {t.conclusion && <div>Then: {t.conclusion.text} — CF: {t.confidence*100}%</div>}
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-12 py-4 text-center text-gray-300 bg-gray-900 border-t border-gray-700">
        <p>Design by: <strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech</p>
      </footer>
    </div>
  );
}
