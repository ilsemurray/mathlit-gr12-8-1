import { useState } from "react";
import { useTeacher } from "../context/TeacherContext";
import { useQuestionBank } from "../context/QuestionBankContext";
import { useTracker, outcomeId } from "../context/TrackerContext";
import {
  generateTopicAssessment,
  generateFormalAssessment,
  generateInvestigation,
} from "../services/gemini";
import { ATP, getTopicById } from "../data/capsTopics";
import Button from "../components/shared/Button";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";
import QuestionBankUploader from "../components/assessments/QuestionBankUploader";
import PaperRenderer from "../components/assessments/PaperRenderer";
import { ASSESSMENT_TYPES, COGNITIVE_LEVEL_COLORS } from "../utils/constants";
import { downloadTextFile } from "../utils/formatters";
import { Link } from "react-router-dom";

// ── Group weeks by main topic name ──────────────────────────────
function groupByTopic(weeks) {
  const groups = {};
  weeks.forEach((week) => {
    if (!groups[week.topic]) groups[week.topic] = [];
    groups[week.topic].push(week);
  });
  return groups;
}

// ── Topic + Outcome Selector ─────────────────────────────────────
// selectedOutcomes: { [outcomeId]: true }
// onChange: (newSelectedOutcomes) => void
function TopicOutcomeSelector({ selectedOutcomes, onChange }) {
  const [open, setOpen] = useState(false);
  const [filterTerm, setFilterTerm] = useState("all");
  const [expandedTopics, setExpandedTopics] = useState({});

  const toggleOutcome = (id) => {
    onChange({ ...selectedOutcomes, [id]: !selectedOutcomes[id] });
  };

  const toggleAllOutcomesForSubtopic = (week) => {
    const ids = (week.learningOutcomes || []).map((_, i) => outcomeId(week.id, i));
    const allSelected = ids.every((id) => selectedOutcomes[id]);
    const next = { ...selectedOutcomes };
    ids.forEach((id) => { next[id] = !allSelected; });
    onChange(next);
  };

  const toggleAllForTopic = (weeks) => {
    const allIds = weeks.flatMap((w) =>
      (w.learningOutcomes || []).map((_, i) => outcomeId(w.id, i))
    );
    const allSelected = allIds.every((id) => selectedOutcomes[id]);
    const next = { ...selectedOutcomes };
    allIds.forEach((id) => { next[id] = !allSelected; });
    onChange(next);
  };

  const clearAll = () => onChange({});

  const toggleExpand = (id) =>
    setExpandedTopics((prev) => ({ ...prev, [id]: !prev[id] }));

  const filteredTerms = filterTerm === "all" ? ATP : ATP.filter((t) => t.term === Number(filterTerm));

  const totalSelected = Object.values(selectedOutcomes).filter(Boolean).length;

  // Build a summary of selected items for display
  const selectedSummary = () => {
    const subtopics = new Set();
    ATP.forEach((term) => term.weeks.forEach((week) => {
      const hasAny = (week.learningOutcomes || []).some((_, i) => selectedOutcomes[outcomeId(week.id, i)]);
      if (hasAny) subtopics.add(week.subtopic);
    }));
    return [...subtopics];
  };

  return (
    <div className="mb-5">
      <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">
        Select Topics &amp; Outcomes for Assessment
      </label>

      {/* Trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm text-left flex items-center justify-between bg-white hover:border-green-400 transition-colors"
      >
        <span className={totalSelected === 0 ? "text-gray-400" : "text-gray-800 font-medium"}>
          {totalSelected === 0
            ? "— Tap to select topics and outcomes —"
            : `${totalSelected} outcome${totalSelected !== 1 ? "s" : ""} selected`}
        </span>
        <span className="text-gray-400 ml-2 flex-shrink-0">{open ? "▲" : "▼"}</span>
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="mt-1 bg-white border border-gray-200 rounded-xl shadow-xl flex flex-col max-h-[75vh]">
          {/* Filter + clear */}
          <div className="flex items-center gap-1.5 p-3 border-b border-gray-100 flex-shrink-0 overflow-x-auto">
            {["all", "1", "2", "3", "4"].map((t) => (
              <button
                key={t}
                onClick={() => setFilterTerm(t)}
                className={`flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                  filterTerm === t ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {t === "all" ? "All Terms" : `Term ${t}`}
              </button>
            ))}
            {totalSelected > 0 && (
              <button onClick={clearAll} className="ml-auto flex-shrink-0 text-xs text-red-500 hover:text-red-700 whitespace-nowrap">
                Clear all
              </button>
            )}
          </div>

          {/* Scrollable topic list */}
          <div className="overflow-y-auto flex-1 p-3 space-y-4">
            {filteredTerms.map((termData) => {
              const grouped = groupByTopic(termData.weeks);
              return (
                <div key={termData.term}>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">
                    Term {termData.term}
                  </p>

                  {Object.entries(grouped).map(([topicName, weeks]) => {
                    const allTopicIds = weeks.flatMap((w) =>
                      (w.learningOutcomes || []).map((_, i) => outcomeId(w.id, i))
                    );
                    const topicSelectedCount = allTopicIds.filter((id) => selectedOutcomes[id]).length;
                    const topicAllSelected = topicSelectedCount === allTopicIds.length;
                    const topicPartial = topicSelectedCount > 0 && !topicAllSelected;

                    return (
                      <div key={topicName} className="mb-3 border border-gray-100 rounded-xl overflow-hidden">
                        {/* Main topic header */}
                        <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
                          <input
                            type="checkbox"
                            checked={topicAllSelected}
                            ref={(el) => { if (el) el.indeterminate = topicPartial; }}
                            onChange={() => toggleAllForTopic(weeks)}
                            className="w-4 h-4 accent-green-600 flex-shrink-0"
                          />
                          <span className="text-sm font-bold text-gray-700 flex-1">{topicName}</span>
                          <span className="text-xs text-gray-400">
                            {topicSelectedCount}/{allTopicIds.length} selected
                          </span>
                        </div>

                        {/* Subtopics */}
                        <div className="divide-y divide-gray-50">
                          {weeks.map((week) => {
                            const outcomeIds = (week.learningOutcomes || []).map((_, i) => outcomeId(week.id, i));
                            const subtopicSelected = outcomeIds.filter((id) => selectedOutcomes[id]).length;
                            const subtopicAllSelected = subtopicSelected === outcomeIds.length;
                            const subtopicPartial = subtopicSelected > 0 && !subtopicAllSelected;
                            const isExpanded = expandedTopics[week.id];

                            return (
                              <div key={week.id} className="bg-white">
                                {/* Subtopic row */}
                                <div className="flex items-start gap-2 px-3 py-2.5">
                                  <input
                                    type="checkbox"
                                    checked={subtopicAllSelected}
                                    ref={(el) => { if (el) el.indeterminate = subtopicPartial; }}
                                    onChange={() => toggleAllOutcomesForSubtopic(week)}
                                    className="mt-0.5 w-4 h-4 accent-green-600 flex-shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-semibold text-gray-800 leading-tight">{week.subtopic}</p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span className="text-xs text-gray-400">
                                        {subtopicSelected}/{outcomeIds.length} outcomes
                                      </span>
                                      {week.cognitiveLevel.map((l) => {
                                        const c = COGNITIVE_LEVEL_COLORS[l] || {};
                                        return (
                                          <span key={l} className={`text-xs px-1 py-0.5 rounded font-medium ${c.bg} ${c.text}`}>{l}</span>
                                        );
                                      })}
                                    </div>
                                  </div>
                                  {/* Expand to see individual outcomes */}
                                  <button
                                    onClick={() => toggleExpand(week.id)}
                                    className="flex-shrink-0 text-xs text-gray-400 hover:text-green-700 px-1 transition-colors"
                                    title="View individual outcomes"
                                  >
                                    {isExpanded ? "▲" : "▼"}
                                  </button>
                                </div>

                                {/* Individual learning outcome checkboxes */}
                                {isExpanded && (
                                  <div className="px-3 pb-3 bg-green-50 border-t border-green-100">
                                    <p className="text-xs text-gray-500 font-semibold mt-2 mb-1.5">
                                      Select individual outcomes:
                                    </p>
                                    <div className="space-y-1.5">
                                      {week.learningOutcomes?.map((outcome, i) => {
                                        const id = outcomeId(week.id, i);
                                        const checked = !!selectedOutcomes[id];
                                        return (
                                          <label
                                            key={id}
                                            className={`flex items-start gap-2 p-2 rounded-lg cursor-pointer border transition-colors ${
                                              checked
                                                ? "bg-green-100 border-green-300"
                                                : "bg-white border-transparent hover:bg-gray-50"
                                            }`}
                                          >
                                            <input
                                              type="checkbox"
                                              checked={checked}
                                              onChange={() => toggleOutcome(id)}
                                              className="mt-0.5 w-3.5 h-3.5 accent-green-600 flex-shrink-0"
                                            />
                                            <span className="text-xs text-gray-700 leading-snug">{outcome}</span>
                                          </label>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Done */}
          <div className="border-t border-gray-100 p-3 flex-shrink-0">
            <Button onClick={() => setOpen(false)} className="w-full justify-center">
              Done — {totalSelected} outcome{totalSelected !== 1 ? "s" : ""} selected
            </Button>
          </div>
        </div>
      )}

      {/* Selected summary chips */}
      {totalSelected > 0 && !open && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {selectedSummary().map((name) => (
            <span key={name} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
              {name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Build topic list for AI prompt from selected outcomes ────────
function buildSelectedTopicsForAI(selectedOutcomes) {
  const result = [];
  ATP.forEach((termData) => {
    termData.weeks.forEach((week) => {
      const selectedForThisWeek = (week.learningOutcomes || []).filter(
        (_, i) => selectedOutcomes[outcomeId(week.id, i)]
      );
      if (selectedForThisWeek.length > 0) {
        result.push({
          ...week,
          term: termData.term,
          // Only pass selected outcomes to the AI
          learningOutcomes: selectedForThisWeek,
        });
      }
    });
  });
  return result;
}

// ── Main Assessments Page ────────────────────────────────────────
export default function Assessments() {
  const { teacher, isProfileComplete } = useTeacher();
  const { hasQuestionBank, hasExemplar, buildExtraContext } = useQuestionBank();

  const [mode, setMode] = useState("formal");
  const [selectedOutcomes, setSelectedOutcomes] = useState({});
  const [assessmentType, setAssessmentType] = useState(ASSESSMENT_TYPES[0]);
  const [term, setTerm] = useState("1");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [mobileView, setMobileView] = useState("config");

  const totalSelected = Object.values(selectedOutcomes).filter(Boolean).length;

  const handleGenerate = async () => {
    if (totalSelected === 0) {
      setError("Please select at least one topic or outcome.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    setMobileView("result");

    try {
      const selectedTopics = buildSelectedTopicsForAI(selectedOutcomes);
      const extraContext = buildExtraContext();
      let content = "";

      if (mode === "topic") {
        content = await generateTopicAssessment(selectedTopics[0], teacher, extraContext);
      } else if (mode === "formal") {
        content = await generateFormalAssessment({
          assessmentType: assessmentType.label,
          selectedTopics,
          teacher,
          totalMarks: assessmentType.marks,
          duration: assessmentType.duration,
          term,
          paper: assessmentType.label.includes("Paper")
            ? assessmentType.label.split("Paper")[1]?.trim()
            : null,
          questionBankText: extraContext,
        });
      } else if (mode === "investigation") {
        content = await generateInvestigation({ selectedTopics, teacher, term, questionBankText: extraContext });
      }

      setResult(content);
    } catch (e) {
      setError(e.message || "Document preparation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getFilename = () => {
    const date = new Date().toISOString().split("T")[0];
    if (mode === "topic") return `TopicAssessment_${date}.txt`;
    if (mode === "investigation") return `Investigation_Term${term}_${date}.txt`;
    return `${assessmentType.label.replace(/ /g, "_")}_Term${term}_${date}.txt`;
  };

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Assessment Generator</h1>
        <p className="text-gray-500 text-sm mt-1">
          Select topics and specific outcomes, then generate a CAPS-aligned assessment with memo.
        </p>
      </div>

      {!isProfileComplete && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-sm text-yellow-800">
          ⚠️ Profile incomplete.{" "}
          <Link to="/settings" className="underline font-medium">Add credentials in Settings</Link>.
        </div>
      )}

      {/* Mobile toggle */}
      <div className="flex lg:hidden gap-2 mb-4">
        {["config", "result"].map((v) => (
          <button
            key={v}
            onClick={() => setMobileView(v)}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              mobileView === v ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {v === "config" ? "⚙️ Options" : "📄 Result"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Config panel */}
        <div className={`${mobileView === "result" ? "hidden lg:block" : ""} bg-white border border-gray-200 rounded-xl p-4 sm:p-5`}>
          <h2 className="font-semibold text-gray-700 mb-4">Assessment Options</h2>

          {/* Mode */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Type</label>
            <div className="flex flex-col gap-2">
              {[
                { id: "formal", label: "📄 Formal Assessment", desc: "Control tests, exams — NSC layout" },
                { id: "investigation", label: "🔍 Investigation / Assignment", desc: "Project-style, take-home" },
                { id: "topic", label: "📋 Topic Quiz", desc: "Quick quiz on selected outcomes" },
              ].map(({ id, label, desc }) => (
                <label key={id} className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  mode === id ? "border-green-500 bg-green-50" : "border-gray-200 hover:border-gray-300"
                }`}>
                  <input type="radio" name="mode" value={id} checked={mode === id}
                    onChange={() => setMode(id)} className="mt-0.5 accent-green-600" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{label}</p>
                    <p className="text-xs text-gray-500">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Format (formal only) */}
          {mode === "formal" && (
            <div className="mb-4">
              <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Format</label>
              <select
                value={assessmentType.value}
                onChange={(e) => setAssessmentType(ASSESSMENT_TYPES.find((t) => t.value === e.target.value))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700"
              >
                {ASSESSMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label} — {t.marks} marks ({t.duration})</option>
                ))}
              </select>
            </div>
          )}

          {/* Term */}
          <div className="mb-4">
            <label className="text-xs font-semibold text-gray-500 uppercase mb-2 block">Term</label>
            <select value={term} onChange={(e) => setTerm(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700">
              {[1, 2, 3, 4].map((t) => <option key={t} value={t}>Term {t}</option>)}
            </select>
          </div>

          {/* Topic + Outcome selector */}
          <TopicOutcomeSelector selectedOutcomes={selectedOutcomes} onChange={setSelectedOutcomes} />

          {/* Question bank */}
          <QuestionBankUploader />

          {/* Header preview */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 text-xs text-green-800">
            <p className="font-semibold mb-1">📋 Paper Header:</p>
            <p>{teacher.schoolName || "School Name"}</p>
            <p>{teacher.name} {teacher.surname}</p>
            <p>Grade 12 Mathematical Literacy · {teacher.year}</p>
            {hasQuestionBank && <p className="mt-1 text-green-600">📚 Question bank: active</p>}
            {hasExemplar && <p className="mt-0.5 text-blue-600">📄 Exemplar format: active</p>}
          </div>

          {error && (
            <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">{error}</div>
          )}

          <Button onClick={handleGenerate} disabled={loading || totalSelected === 0}
            className="w-full justify-center py-3 text-base">
            {loading ? "Preparing document..." : "✨ Generate Assessment + Memo"}
          </Button>

          {totalSelected === 0 && (
            <p className="text-xs text-center text-gray-400 mt-2">Select outcomes above to enable generation</p>
          )}
        </div>

        {/* Result panel */}
        <div className={mobileView === "config" ? "hidden lg:block" : ""}>
          <h2 className="text-sm font-semibold text-gray-600 uppercase tracking-wide mb-3">Generated Assessment</h2>
          {loading && <LoadingSpinner message="Preparing your document, please wait..." />}
          {!loading && error && !result && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
          )}
          {!loading && result && (
            <PaperRenderer
              rawText={result}
              teacher={teacher}
              assessmentType={assessmentType.label}
              totalMarks={assessmentType.marks}
              duration={assessmentType.duration}
              term={term}
              filename={getFilename()}
            />
          )}
          {!loading && !result && (
            <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 min-h-64">
              <EmptyState icon="📝" title="Assessment will appear here"
                description="Select topics and outcomes, then tap Generate." />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
