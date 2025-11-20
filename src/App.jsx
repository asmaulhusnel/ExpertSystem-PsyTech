import React, { useEffect, useState } from "react";
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

    const rid =
      "r" + (kb.rules.length + 1 + Math.floor(Math.random() * 1000));
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
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: "url('/bg-psytech.jpg')", // ← GANTI SESUAI NAMA FILE
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* CONTENT */}
      <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
        <div className="max-w-5xl w-full grid md:grid-cols-2 gap-6">
          
          {/* LEFT SIDE */}
          <div className="p-6 rounded-2xl bg-white/80 shadow-lg backdrop-blur">
            <h1 className="text-2xl font-bold mb-2 text-gray-800">
              PsyTech — Diagnosa Psikologis
            </h1>
            <p className="text-sm text-gray-700 mb-4">
              Pilih gejala kemudian jalankan inferensi.
            </p>

            <div>
              <h3 className="font-semibold mb-2">Pilih Gejala</h3>
              <div className="space-y-2 max-h-56 overflow-auto pr-2">
                {kb.symptoms.map((s) => (
                  <label key={s.id} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      checked={selectedSymptoms.includes(s.id)}
                      onChange={() => toggleSymptom(s.id)}
                    />
                    <span>{s.text}</span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 mt-4">
                <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={runInference}>
                  Diagnosa
                </button>
                <button className="px-4 py-2 border rounded" onClick={reset}>
                  Reset
                </button>
              </div>

              {/* RESULT */}
              <div className="mt-4">
                <h4 className="font-semibold">Hasil</h4>

                {!result && (
                  <p className="text-sm text-gray-600">
                    Belum ada hasil. Klik Diagnosa.
                  </p>
                )}

                {result && (
                  <div className="space-y-3 mt-2">
                    <div>
                      <strong>Fakta akhir:</strong>
                      <div className="text-sm">
                        {result.facts.map((f) => (
                          <div key={f}>{symptomMap[f] || f}</div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong>Diagnosa:</strong>
                      <ul className="list-disc pl-5">
                        {result.diagnoses.length === 0 && (
                          <li>Tidak ada diagnosis otomatis.</li>
                        )}
                        {result.diagnoses.map((d) => (
                          <li key={d.ruleId}>
                            <strong>{d.diagnosisText}</strong> — confidence:{" "}
                            {Math.round(d.confidence * 100)}%
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div>
                      <strong>Trace:</strong>
                      <div className="max-h-36 overflow-auto text-xs bg-gray-50 p-2 rounded mt-1">
                        {result.trace.map((t, i) => (
                          <div key={i} className="mb-2">
                            <div>
                              Rule: <code>{t.ruleId}</code> — fired:{" "}
                              {String(!!t.fired)}
                            </div>
                            <div>
                              Matched:{" "}
                              {t.matched
                                ? t.matched
                                    .map((m) => symptomMap[m] || m)
                                    .join(", ")
                                : "-"}
                            </div>
                            {t.conclusion && (
                              <div>
                                Then: {t.conclusion.text} (id:{" "}
                                {t.conclusion.id})
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="p-6 rounded-2xl bg-white/80 shadow-lg backdrop-blur">
            <h3 className="text-lg font-semibold mb-2">Knowledge Base Editor</h3>
            <p className="text-sm text-gray-700 mb-4">
              Tambah gejala dan rule (tidak permanen, hanya memory).
            </p>

            {/* Add Symptom */}
            <div className="mb-4">
              <h4 className="font-medium">Tambah Gejala</h4>
              <form onSubmit={addSymptom} className="flex gap-2 mt-2">
                <input
                  value={newSymptomText}
                  onChange={(e) => setNewSymptomText(e.target.value)}
                  placeholder="Contoh: sering cemas..."
                  className="flex-1 p-2 border rounded"
                />
                <button className="px-3 bg-green-600 text-white rounded">
                  Tambah
                </button>
              </form>
            </div>

            {/* Add Rule */}
            <div className="mb-4">
              <h4 className="font-medium">Tambah Rule</h4>

              <div className="text-sm text-gray-600">
                Pilih premis (gejala):
              </div>
              <div className="max-h-32 overflow-auto mt-2 pr-2">
                {kb.symptoms.map((s) => (
                  <label
                    key={s.id}
                    className="flex items-center space-x-3"
                  >
                    <input
                      type="checkbox"
                      checked={newRulePremises.includes(s.id)}
                      onChange={() => toggleNewPremise(s.id)}
                    />
                    <span className="text-sm">{s.text}</span>
                  </label>
                ))}
              </div>

              <form onSubmit={addRule} className="mt-3 space-y-2">
                <input
                  value={newRuleConclusionText}
                  onChange={(e) =>
                    setNewRuleConclusionText(e.target.value)
                  }
                  placeholder="Kesimpulan / diagnosis"
                  className="w-full p-2 border rounded"
                />

                <div className="flex items-center gap-2">
                  <label className="text-sm">Confidence:</label>
                  <input
                    type="number"
                    step="0.05"
                    min="0.1"
                    max="1"
                    value={newRuleConfidence}
                    onChange={(e) =>
                      setNewRuleConfidence(e.target.value)
                    }
                    className="p-1 border rounded w-24"
                  />

                  <button
                    className="ml-auto px-3 bg-indigo-600 text-white rounded"
                  >
                    Tambah Rule
                  </button>
                </div>
              </form>
            </div>

            {/* Rules List */}
            <div className="mt-4">
              <h4 className="font-medium">Rules saat ini</h4>
              <div className="max-h-40 overflow-auto text-sm mt-2">
                {kb.rules.map((r) => (
                  <div key={r.id} className="mb-2 p-2 border rounded">
                    <div>
                      <strong>{r.id}</strong> — {r.then.text} (conf:{" "}
                      {r.confidence})
                    </div>
                    <div className="text-xs">
                      if:{" "}
                      {r.if
                        .map((i) => symptomMap[i] || i)
                        .join(" • ")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-4 text-xs text-gray-600">
              Data permanen ada di{" "}
              <code>src/data/knowledge.json</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
{/* FOOTER DESIGNER */}
<div className="absolute bottom-3 w-full text-center text-white/80 text-xs z-20">
  Design by: <strong>Asmaul Husnah Nasrullah</strong>
</div>
