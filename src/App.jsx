import React, { useState, useEffect } from "react";
import kbSource from "./data/knowledge.json";
import bgImage from "./bg.jpg";
import logoImage from "./logo.png"; // Tambahkan logo di folder project

const clone = (v) => JSON.parse(JSON.stringify(v));

function forwardChaining(initialFacts, rules) {
  // ... forwardChaining sama seperti sebelumnya
}

export default function App() {
  const [kb, setKb] = useState(() => clone(kbSource));
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [newSymptomText, setNewSymptomText] = useState("");
  const [newRulePremises, setNewRulePremises] = useState([]);
  const [newRuleConclusionText, setNewRuleConclusionText] = useState("");
  const [newRuleConfidence, setNewRuleConfidence] = useState(0.7);
  
  // Modal bantuan
  const [helpOpen, setHelpOpen] = useState(false);

  // Splash page
  const [showSplash, setShowSplash] = useState(true);

  // otomatis hilang setelah 3 detik
  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 3000);
    return () => clearTimeout(timer);
  }, []);

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

  function toggleNewPremise(id) {
    setNewRulePremises((p) =>
      p.includes(id) ? p.filter((x) => x !== id) : [...p, id]
    );
  }

  function addRule(e) {
    e.preventDefault();
    if (newRulePremises.length === 0)
      return alert("Pilih minimal satu premis.");
    if (!newRuleConclusionText.trim())
      return alert("Masukkan teks kesimpulan / diagnosa.");
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
    alert("Rule berhasil ditambahkan (disimpan sementara).");
  }

  const symptomMap = {};
  kb.symptoms.forEach((s) => (symptomMap[s.id] = s.text));

  // --- Render ---
  if (showSplash) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-black text-white">
        <img src={logoImage} alt="Logo" className="w-32 h-32 rounded-full mb-4" />
        <h1 className="text-2xl font-bold text-yellow-300 mb-2">Diagnosa Masalah Psikologi</h1>
        <p className="text-gray-300 text-center max-w-xs">
          Selamat datang di <strong>PsyTech</strong>, aplikasi pakar berbasis web untuk mendiagnosa kondisi psikologis menggunakan metode forward chaining.
        </p>
        <button
          className="mt-6 px-6 py-2 bg-yellow-400 text-black rounded hover:bg-yellow-500 transition"
          onClick={() => setShowSplash(false)}
        >
          Mulai
        </button>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative bg-cover bg-center text-white"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div className="absolute inset-0 bg-black/70 z-0"></div>

      {/* Navbar */}
      <header className="fixed top-0 w-full z-20 bg-black/80 border-b border-gray-700 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-3 flex justify-between items-center">
          <div className="text-xl font-bold tracking-wide">PsyTech</div>
          <div className="flex space-x-6 text-sm">
            <button onClick={() => setPage("dashboard")} className="hover:text-yellow-400 transition">Dashboard</button>
            <button onClick={() => setPage("konsultasi")} className="hover:text-yellow-400 transition">Konsultasi</button>
            <button onClick={() => setPage("knowledge-base")} className="hover:text-yellow-400 transition">Knowledge Base</button>
            <button onClick={() => setHelpOpen(true)} className="hover:text-yellow-400 transition">Bantuan</button>
          </div>
        </div>
      </header>

      {/* Modal Bantuan */}
      {helpOpen && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 rounded-xl p-6 max-w-md w-full text-white relative">
            <button
              onClick={() => setHelpOpen(false)}
              className="absolute top-2 right-2 text-gray-400 hover:text-yellow-400"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold mb-4 text-yellow-400">Bantuan & Kontak</h2>
            <p className="mb-2">Pengembang: <strong>Asmaul Husnah Nasrullah</strong></p>
            <p className="mb-2">Email: <a href="mailto:Asmaul.husnah@unm.ac.id" className="text-yellow-300 underline">Asmaul.husnah@unm.ac.id</a></p>
            <p className="mb-2">Kontak: 0821-9353-3471</p>
            <p className="mt-4">
              Jika Anda ingin mengembangkan aplikasi ini menggunakan metode inferensi lain, 
              silakan menghubungi kontak di atas.
            </p>
          </div>
        </div>
      )}

      <main className="pt-24 max-w-6xl mx-auto px-6 relative z-10">
        {/* ... semua konten dashboard, konsultasi, knowledge-base sama seperti sebelumnya ... */}
      </main>

      <footer className="py-4 text-center text-gray-400 text-sm bg-black/80 border-t border-gray-700">
        <p><strong>Asmaul Husnah Nasrullah</strong> | 2025 © PsyTech</p>
      </footer>
    </div>
  );
}
