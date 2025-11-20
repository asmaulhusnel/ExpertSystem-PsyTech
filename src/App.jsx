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
    <div className="min-h-screen bg-yellow-50">
      {/* Header */}
      <header className="bg-yellow-400 text-white py-4 shadow-md">
        <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
          <div className="font-bold text-xl">PsyTech</div>
          <nav className="space-x-6 text-sm">
            <a href="#" className="hover:underline">Dashboard</a>
            <a href="#konsultasi" className="hover:underline">Konsultasi</a>
            <a href="#about" className="hover:underline">About</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-6">
        <h1 className="text-3xl font-bold text-center mb-6 text-yellow-900">
          Sistem Pakar Diagnosa Psikologis
        </h1>
        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT: Konsultasi */}
          <div className="p-6 bg-white rounded-2xl shadow-md">
            <h2 className="text-xl font-semibold mb-4">Pilih Gejala</h2>
            <div className="space-y-2 max-h-64 overflow-auto pr-2">
              {kb.symptoms.map((s) => (
                <label key={s.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(s.id)}
                    onChange={() => toggleSymptom(s.id)}
                    className="accent-yellow-500"
                  />
                  <span>{s.text}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={runInference}
                className="px-4 py-2 bg-yellow-500 rounded text-white hover:bg-yellow-600 transition"
              >
                Diagnosa
              </button>
              <button
                onClick={reset}
                className="px-4 py-2 bg-gray-200 rounded text-black hover:bg-gray-300 transition"
              >
                Reset
              </button>
            </div>
          </div>

          {/* RIGHT: Hasil */}
          <div className="p-6 bg-white rounded-2xl shadow-md max-h-[600px] overflow-auto">
            <h2 className="text-xl font-semibold mb-4">Hasil Diagnosis</h2>
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
                  <div className="text-xs max-h-36 overflow-auto bg-yellow-100 p-2 rounded mt-1">
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
      </main>

      {/* Footer */}
      <footer className="mt-12 py-4 text-center bg-yellow-400 text-white rounded-t-md shadow-md">
        <p>Design by: Asmaul Husnah Nasrullah | 2025 © PsyTech</p>
      </footer>
    </div>
  );
}
