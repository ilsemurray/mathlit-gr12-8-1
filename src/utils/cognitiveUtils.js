import { COGNITIVE_LEVELS } from "../data/capsTopics";

/**
 * Parse a cognitive level summary table from AI-generated text
 * Returns structured data for the CognitiveLevelTable component
 */
export function parseCognitiveLevelTable(text) {
  const lines = text.split("\n").filter((l) => l.includes("|"));
  if (!lines.length) return null;

  const rows = lines.map((line) =>
    line
      .split("|")
      .map((cell) => cell.trim())
      .filter(Boolean)
  );

  return rows;
}

/**
 * Calculate if cognitive level distribution meets CAPS requirements
 * Returns warnings for any level that is more than 5% outside target
 */
export function validateCognitiveLevels(distribution, totalMarks) {
  const warnings = [];
  const targets = { L1: 30, L2: 30, L3: 20, L4: 20 };

  Object.entries(distribution).forEach(([level, marks]) => {
    const actual = Math.round((marks / totalMarks) * 100);
    const target = targets[level];
    if (Math.abs(actual - target) > 5) {
      warnings.push(
        `${COGNITIVE_LEVELS[level]?.name} (${level}): ${actual}% — target is ~${target}%`
      );
    }
  });

  return warnings;
}

/**
 * Format a cognitive level summary for display
 */
export function formatCognitiveSummary(distribution, totalMarks) {
  return Object.entries(COGNITIVE_LEVELS).map(([key, level]) => ({
    level: key,
    name: level.name,
    marks: distribution[key] || 0,
    percentage: totalMarks
      ? Math.round(((distribution[key] || 0) / totalMarks) * 100)
      : 0,
    target: level.capsWeighting,
  }));
}
