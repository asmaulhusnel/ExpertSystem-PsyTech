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
    <div
      className="min-h-screen relative bg-cover bg-center"
      style={{ backgroundImage: "url('/bg-psytech.jpg')" }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-20 backdrop-blur-md bg-white/10 border-b border-white/20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center text-white">
          <div className="text-xl font-bold tracking-wide">PsyTech</div>
          <div className="flex space-x-6 text-sm">
            <a href="#" className="hover:text-blue-300 transition">Dashboard</a>
            <a href="#konsultasi" className="hover:text-blue-300 transition">Konsultasi</a>
            <a href="#" className="hover:text-blue-300 transition">About</a>
          </div>
        </div>
      </header>

      <main className="pt-24 max-w-6xl mx-auto px-6 relative z-10 text-white">
        <h1 className="text-4xl font-bold text-center mb-6">Diagnosa Psikologis Mahasiswa</h1>

        <div className="grid md:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-lg" id="konsultasi">
            <h2 className="text-xl font-semibold mb-4">Pilih Gejala</h2>
            <div className="space-y-2 max-h-64 overflow-auto pr-2">
              {kb.symptoms.map((s) => (
                <label key={s.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedSymptoms.includes(s.id)}
                    onChange={() => toggleSymptom(s.id)}
                    className="accent-blue-500"
                  />
                  <span>{s.text}</span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={runInference} className="px-4 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 transition">
                Diagnosa
              </button>
              <button onClick={reset} className="px-4 py-2 bg-gray-300 rounded text-black hover:bg-gray-400 transition">
                Reset
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div className="p-6 rounded-2xl bg-white/20 backdrop-blur-lg border border-white/20 shadow-lg max-h-[600px] overflow-auto">
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
                  <div className="text-xs max-h-36 overflow-auto bg-white/10 p-2 rounded mt-1">
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
      </main>

     {/* Footer */}
<footer className="mt-12 py-4 text-center text-white/80 text-sm backdrop-blur-md bg-white/10 border-t border-white/20">
  <p>Design by: <strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech</p>
</footer>

{/* Admin Forms Bawah Footer */}
<div className="max-w-4xl mx-auto my-6 p-6 bg-white/20 backdrop-blur-lg rounded-2xl border border-white/20 shadow-lg text-white">
  <h3 className="text-lg font-semibold mb-3">Tambah Gejala & Rule (Admin)</h3>

  {/* Tambah Gejala */}
  <div className="mb-4">
    <h4 className="font-medium mb-1">Tambah Gejala</h4>
    <form onSubmit={addSymptom} className="flex gap-2">
      <input
        type="text"
        value={newSymptomText}
        onChange={(e) => setNewSymptomText(e.target.value)}
        placeholder="Contoh: Sering cemas"
        className="flex-1 p-2 border rounded text-black"
      />
      <button
        type="submit"
        className="px-3 bg-green-600 rounded hover:bg-green-700 transition"
      >
        Tambah Gejala
      </button>
    </form>
  </div>

  {/* Tambah Rule */}
  <div className="mb-2">
    <h4 className="font-medium mb-1">Tambah Rule (If → Then)</h4>
    <div className="text-sm text-white/80 mb-1">Pilih premis:</div>
    <div className="flex flex-wrap gap-2 max-h-32 overflow-auto mb-2">
      {kb.symptoms.map((s) => (
        <label key={s.id} className="flex items-center space-x-1 bg-white/20 px-2 py-1 rounded cursor-pointer hover:bg-white/30 transition">
          <input
            type="checkbox"
            checked={newRulePremises.includes(s.id)}
            onChange={() => toggleNewPremise(s.id)}
            className="accent-blue-500"
          />
          <span className="text-sm">{s.text}</span>
        </label>
      ))}
    </div>

    <form onSubmit={addRule} className="space-y-2">
      <input
        type="text"
        value={newRuleConclusionText}
        onChange={(e) => setNewRuleConclusionText(e.target.value)}
        placeholder="Kesimpulan / diagnosis"
        className="w-full p-2 border rounded text-black"
      />
      <div className="flex items-center gap-2">
        <label className="text-sm">Confidence:</label>
        <input
          type="number"
          step="0.05"
          min="0.1"
          max="1"
          value={newRuleConfidence}
          onChange={(e) => setNewRuleConfidence(e.target.value)}
          className="p-1 border rounded w-24 text-black"
        />
        <button
          type="submit"
          className="ml-auto px-3 bg-indigo-600 rounded hover:bg-indigo-700 transition"
        >
          Tambah Rule
        </button>
      </div>
    </form>
  </div>

  <div className="text-xs text-white/70 mt-2">
    Catatan: Penambahan gejala dan rule hanya tersimpan sementara di memory.
  </div>
</div>

