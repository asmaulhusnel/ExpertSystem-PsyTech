import React, { useState } from "react";
import kbSource from "./data/knowledge.json";

const clone = (v) => JSON.parse(JSON.stringify(v));

function forwardChaining(selectedSymptoms, rules) {
  const facts = new Set(selectedSymptoms);
  const inferred = new Set();
  const trace = [];
  const fired = new Set();
  let changed = true;

  while (changed) {
    changed = false;
    for (const rule of rules) {
      if (fired.has(rule.id)) continue;
      const allMatch = rule.if.every((s) => facts.has(s));
      if (allMatch) {
        facts.add(rule.then.id);
        inferred.add(rule.then.id);
        fired.add(rule.id);
        changed = true;
        trace.push({ ruleId: rule.id, fired: true, matched: rule.if, conclusion: rule.then });
      }
    }
  }

  const diagnoses = [];
  for (const rule of rules) {
    if (fired.has(rule.id)) diagnoses.push(rule.then.text);
  }

  return { facts: Array.from(facts), diagnoses, trace };
}

export default function App() {
  const [kb] = useState(() => clone(kbSource));
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [result, setResult] = useState(null);

  const toggleSymptom = (id) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const runInference = () => {
    const res = forwardChaining(selectedSymptoms, kb.rules);
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

      {/* NAVBAR */}
      <d
