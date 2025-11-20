// rules.js
export const knowledgeBase = [
  { id: "r1", kondisi: ["Sering cemas", "Sulit tidur"], hasil: "Gangguan Kecemasan Umum" },
  { id: "r2", kondisi: ["Sedih berkepanjangan", "Tidak bersemangat"], hasil: "Depresi Ringan" },
  { id: "r3", kondisi: ["Mudah marah", "Sulit tidur"], hasil: "Stress Akademik Tinggi" }
];

export function forwardChaining(selectedSymptoms, rules = knowledgeBase) {
  const facts = new Set(selectedSymptoms);
  const diagnoses = new Set();
  const trace = [];

  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of rules) {
      // Jika semua kondisi terpenuhi
      const allMatch = rule.kondisi.every((c) => facts.has(c));
      if (allMatch && !diagnoses.has(rule.hasil)) {
        diagnoses.add(rule.hasil);
        trace.push({ ruleId: rule.id, fired: true, matched: rule.kondisi, conclusion: rule.hasil });
        changed = true;
      } else if (!allMatch) {
        trace.push({ ruleId: rule.id, fired: false, matched: rule.kondisi.filter((c) => facts.has(c)), conclusion: rule.hasil });
      }
    }
  }

  return {
    facts: Array.from(facts),
    diagnoses: Array.from(diagnoses),
    trace
  };
}
