/**
 * Format a date to South African locale
 */
export function formatDate(date = new Date()) {
  return new Intl.DateTimeFormat("en-ZA", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
}

/**
 * Format a term label
 */
export function termLabel(term) {
  return `Term ${term}`;
}

/**
 * Format topic duration
 */
export function formatWeeks(weekStart, weekEnd) {
  if (weekStart === weekEnd) return `Week ${weekStart}`;
  return `Weeks ${weekStart}–${weekEnd}`;
}

/**
 * Truncate text to a max length
 */
export function truncate(text, max = 100) {
  if (!text) return "";
  return text.length > max ? text.slice(0, max) + "…" : text;
}

/**
 * Download a text file (for assessments and memos)
 */
export function downloadTextFile(content, filename) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
