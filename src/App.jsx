import React, { useState } from "react";
import { knowledgeBase } from "./data/knowledge";

export default function App() {
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [diagnosis, setDiagnosis] = useState([]);

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom]
    );
  };

  const runDiagnosis = () => {
    let results = {};

    knowledgeBase.forEach((item) => {
      if (selectedSymptoms.includes(item.symptom)) {
        item.conditions.forEach((cond) => {
          results[cond] = (results[cond] || 0) + 1;
        });
      }
    });

    const finalResult = Object.entries(results).sort((a, b) => b[1] - a[1]);

    setDiagnosis(finalResult);
  };

  return (
    <div className="min-h-screen bg-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-blue-700 mb-6">
        PsyTech – Sistem Pakar Psikologi Mahasiswa
      </h1>

      {/* Symptoms Section */}
      <div className="bg-white shadow-xl p-6 rounded-xl w-full max-w-2xl">
        <h2 className="text-xl font-semibold mb-4">Pilih Gejala Anda</h2>

        {knowledgeBase.map((item) => (
          <label key={item.id} className="flex items-center space-x-3 my-2">
            <input
              type="checkbox"
              checked={selectedSymptoms.includes(item.symptom)}
              onChange={() => handleSymptomChange(item.symptom)}
              className="w-5 h-5 text-blue-600"
            />
            <span>{item.symptom}</span>
          </label>
        ))}

        <button
          onClick={runDiagnosis}
          className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-semibold"
        >
          Diagnosa Sekarang
        </button>
      </div>

      {/* Result Section */}
      {diagnosis.length > 0 && (
        <div className="bg-white shadow-xl p-6 rounded-xl w-full max-w-2xl mt-6">
          <h2 className="text-xl font-semibold mb-4">Hasil Diagnosa</h2>

          {diagnosis.map(([condition, score], index) => (
            <p key={index} className="text-lg">
              <strong>{condition}</strong> — kecocokan: {score}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
