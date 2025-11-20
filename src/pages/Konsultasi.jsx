import React, { useState } from "react";
import kbSource from "../data/knowledge.json";

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

export default function Konsultasi() {
  const [kb, setKb] = useState(() => clone(kbSource));
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  function toggleSymptom(id) {
    setSelectedSymptoms((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id]
    );
  }

  function runInference() {
    setResult(forwardChaining(selectedSymptoms, kb.rules));
  }

  function reset() {
    setSelectedSymptoms([]);
    setResult(null);
  }

  const symptomMap = {};
  kb.symptoms.forEach((s) => (symptomMap[s.id] = s.text));

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* LEFT */}
      <div className="p-6 rounded-2xl bg-white/50 shadow-lg backdrop-blur-lg border border-yellow-300">
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
          <button onClick={runInference} className="px-4 py-2 bg-yellow-500 rounded text-white hover:bg-yellow-600 transition">
            Diagnosa
          </button>
          <button onClick={reset} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
            Reset
          </button>
        </div>
      </div>

      {/* RIGHT */}
      <div className="p-6 rounded-2xl bg-white/50 backdrop-blur-lg border border-yellow-300 shadow-lg max-h-[600px] overflow-auto">
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
              <div className="text-xs max-h-36 overflow-auto bg-white/20 p-2 rounded mt-1">
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
  );
}
