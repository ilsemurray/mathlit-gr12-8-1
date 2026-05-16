import { useState } from "react";
import { ATP } from "../data/capsTopics";
import { useTracker, outcomeId, getOutcomeIds } from "../context/TrackerContext";
import { TOPIC_COLORS, COGNITIVE_LEVEL_COLORS } from "../utils/constants";
import { formatWeeks } from "../utils/formatters";

// ── Individual subtopic card with outcome checkboxes ─────────────
function SubtopicCard({ week }) {
  const {
    toggleOutcome,
    toggleAllOutcomes,
    isOutcomeTaught,
    isTopicFullyTaught,
    isTopicPartiallyTaught,
    countTaughtOutcomes,
  } = useTracker();

  const [expanded, setExpanded] = useState(false);

  const totalOutcomes = week.learningOutcomes?.length || 0;
  const taughtCount = countTaughtOutcomes(week);
  const fullyTaught = isTopicFullyTaught(week);
  const partiallyTaught = isTopicPartiallyTaught(week);
  const topicColor = TOPIC_COLORS[week.topic] || "bg-gray-50 border-gray-200";

  return (
    <div className={`border rounded-xl overflow-hidden transition-all ${
      fullyTaught ? "border-green-400" : partiallyTaught ? "border-yellow-300" : "border-gray-200"
    }`}>
      {/* ── Subtopic header ── */}
      <div className={`p-3 sm:p-4 ${
        fullyTaught ? "bg-green-50" : partiallyTaught ? "bg-yellow-50" : topicColor
      }`}>
        <div className="flex items-start gap-3">
          {/* Master checkbox — toggles all outcomes */}
          <div className="flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={fullyTaught}
              ref={(el) => { if (el) el.indeterminate = partiallyTaught; }}
              onChange={() => toggleAllOutcomes(week)}
              className="w-5 h-5 accent-green-600 cursor-pointer"
              title={fullyTaught ? "Mark all as not taught" : "Mark all as taught"}
            />
          </div>

          {/* Title + meta */}
          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
            {/* Badges */}
            <div className="flex flex-wrap gap-1.5 mb-1">
              <span className="text-xs text-gray-400">{formatWeeks(week.weekStart, week.weekEnd)}</span>
              <span className="text-xs px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500 truncate max-w-[180px]">
                {week.topic}
              </span>
              {week.cognitiveLevel.map((l) => {
                const c = COGNITIVE_LEVEL_COLORS[l] || {};
                return (
                  <span key={l} className={`text-xs px-1.5 py-0.5 rounded font-medium ${c.bg} ${c.text}`}>{l}</span>
                );
              })}
            </div>

            {/* Subtopic name */}
            <p className="font-semibold text-gray-800 text-sm sm:text-base leading-snug">{week.subtopic}</p>

            {/* Progress indicator */}
            <div className="flex items-center gap-2 mt-1.5">
              <div className="flex-1 bg-gray-200 rounded-full h-1.5 max-w-[120px]">
                <div
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    fullyTaught ? "bg-green-500" : partiallyTaught ? "bg-yellow-400" : "bg-gray-300"
                  }`}
                  style={{ width: `${totalOutcomes > 0 ? (taughtCount / totalOutcomes) * 100 : 0}%` }}
                />
              </div>
              <span className="text-xs text-gray-500">
                {taughtCount}/{totalOutcomes} outcomes
              </span>
              {fullyTaught && <span className="text-xs text-green-600 font-semibold">✓ Complete</span>}
              {partiallyTaught && <span className="text-xs text-yellow-600 font-semibold">In progress</span>}
            </div>
          </div>

          {/* Expand toggle */}
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex-shrink-0 text-xs text-gray-400 hover:text-green-700 font-medium transition-colors px-1"
          >
            {expanded ? "▲" : "▼"}
          </button>
        </div>
      </div>

      {/* ── Expanded: Learning Outcomes as checkboxes ── */}
      {expanded && (
        <div className="bg-white border-t border-gray-100">
          {/* Outcomes section */}
          <div className="px-4 pt-3 pb-2">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
              Learning Outcomes — tick when taught
            </p>
            <div className="space-y-2">
              {week.learningOutcomes?.map((outcome, i) => {
                const id = outcomeId(week.id, i);
                const taught = isOutcomeTaught(id);
                return (
                  <label
                    key={id}
                    className={`flex items-start gap-3 p-2.5 rounded-lg cursor-pointer transition-colors border ${
                      taught
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-transparent hover:bg-gray-100"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={taught}
                      onChange={() => toggleOutcome(id)}
                      className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0"
                    />
                    <span className={`text-sm leading-snug ${taught ? "text-green-800 line-through opacity-75" : "text-gray-700"}`}>
                      {outcome}
                    </span>
                    {taught && <span className="ml-auto flex-shrink-0 text-green-500 text-xs">✓</span>}
                  </label>
                );
              })}
            </div>
          </div>

          {/* Misconceptions section */}
          {week.misconceptions?.length > 0 && (
            <div className="px-4 pb-3 border-t border-gray-100 mt-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-3 mb-2">
                Common Misconceptions
              </p>
              {week.misconceptions.map((m, i) => (
                <div key={i} className="bg-red-50 border border-red-100 rounded-lg p-3 mb-2">
                  <p className="text-xs font-semibold text-red-700 mb-1">⚠️ {m.misconception}</p>
                  <p className="text-xs text-red-600 mb-2">{m.description}</p>
                  <div className="bg-white rounded p-2 border border-red-100">
                    <p className="text-xs font-semibold text-gray-500 mb-0.5">Teaching Strategy:</p>
                    <p className="text-xs text-gray-700">{m.teachingStrategy}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Teaching Methods */}
          {week.teachingMethods?.length > 0 && (
            <div className="px-4 pb-4 border-t border-gray-100">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mt-3 mb-2">
                Teaching Methods
              </p>
              <ul className="space-y-1">
                {week.teachingMethods.map((m, i) => (
                  <li key={i} className="flex gap-2 text-xs text-gray-600">
                    <span className="text-green-500 flex-shrink-0">→</span>{m}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Group subtopics by their main topic ──────────────────────────
function groupByTopic(weeks) {
  const groups = {};
  weeks.forEach((week) => {
    if (!groups[week.topic]) groups[week.topic] = [];
    groups[week.topic].push(week);
  });
  return groups;
}

// ── Main Tracker Page ────────────────────────────────────────────
export default function Tracker() {
  const [activeTerm, setActiveTerm] = useState(1);
  const { termProgress, countTaughtOutcomes, isTopicFullyTaught } = useTracker();

  const termData = ATP.find((t) => t.term === activeTerm);
  const grouped = groupByTopic(termData?.weeks || []);

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">ATP Tracker</h1>
        <p className="text-gray-500 text-sm mt-1">
          Tick each learning outcome as you teach it. The master checkbox marks the entire subtopic.
        </p>
      </div>

      {/* Term tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1">
        {[1, 2, 3, 4].map((term) => (
          <button
            key={term}
            onClick={() => setActiveTerm(term)}
            className={`flex-shrink-0 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTerm === term
                ? "bg-green-700 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:border-green-400"
            }`}
          >
            Term {term}
            <span className={`ml-1.5 text-xs ${activeTerm === term ? "text-green-200" : "text-gray-400"}`}>
              {termProgress[term]}%
            </span>
          </button>
        ))}
      </div>

      {/* Term progress bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 mb-5">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Term {activeTerm} — Outcomes Covered</span>
          <span className="font-semibold text-green-700">{termProgress[activeTerm]}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3">
          <div
            className="bg-green-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${termProgress[activeTerm]}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1.5">
          {termData?.totalWeeks} teaching weeks · {termData?.weeks.length} subtopics
        </p>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 mb-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-green-500 inline-block" /> Complete
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-yellow-400 inline-block" /> In progress
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-gray-300 inline-block" /> Not started
        </span>
      </div>

      {/* Topics grouped by main topic */}
      {Object.entries(grouped).map(([topicName, weeks]) => (
        <div key={topicName} className="mb-6">
          {/* Main topic heading */}
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px flex-1 bg-gray-200" />
            <h2 className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2 whitespace-nowrap">
              {topicName}
            </h2>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Subtopic cards */}
          <div className="flex flex-col gap-3">
            {weeks.map((week) => (
              <SubtopicCard key={week.id} week={week} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
