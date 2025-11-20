// rules.js
export const knowledgeBase = [
  { id: "r1", kondisi: ["Sering cemas", "Sulit tidur"], hasil: "Gangguan Kecemasan Umum", cf: 0.8 },
  { id: "r2", kondisi: ["Sedih berkepanjangan", "Tidak bersemangat"], hasil: "Depresi Ringan", cf: 0.7 },
  { id: "r3", kondisi: ["Mudah marah", "Sulit tidur"], hasil: "Stress Akademik Tinggi", cf: 0.6 }
];

/**
 * Forward chaining dengan CF
 * @param {string[]} selectedSymptoms 
 * @param {object[]} rules 
 * @returns {facts[], diagnoses[], trace[]}
 */
export function forwardChaining(selectedSymptoms, rules = knowledgeBase) {
  const facts = new Set(selectedSymptoms);
  const diagnoses = [];
  const trace = [];

  let changed = true;
  while (changed) {
    changed = false;
    for (const rule of rules) {
      const allMatch = rule.kondisi.every((c) => facts.has(c));
      if (allMatch && !diagnoses.find(d => d.hasil === rule.hasil)) {
        diagnoses.push({ hasil: rule.hasil, cf: rule.cf });
        trace.push({ ruleId: rule.id, fired: true, matched: rule.kondisi, conclusion: rule.hasil, cf: rule.cf });
        changed = true;
      } else if (!allMatch) {
        trace.push({ ruleId: rule.id, fired:
