import { useState } from "react";
import { ATP } from "../data/capsTopics";
import { generateLesson } from "../services/gemini";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/shared/Button";
import LoadingSpinner from "../components/shared/LoadingSpinner";
import EmptyState from "../components/shared/EmptyState";
import { TOPIC_COLORS, COGNITIVE_LEVEL_COLORS } from "../utils/constants";
import { formatWeeks, downloadTextFile } from "../utils/formatters";

function MisconceptionCard({ item }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
      <p className="font-medium text-red-800 text-sm mb-1">⚠️ {item.misconception}</p>
      <p className="text-red-700 text-xs mb-2">{item.description}</p>
      <div className="bg-white rounded p-2 border border-red-100">
        <p className="text-xs font-semibold text-gray-600 mb-0.5">Teaching Strategy:</p>
        <p className="text-xs text-gray-700">{item.teachingStrategy}</p>
      </div>
    </div>
  );
}

function TopicSelector({ onSelect, selectedId }) {
  const [activeTerm, setActiveTerm] = useState(1);
  const termData = ATP.find((t) => t.term === activeTerm);

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      {/* Term tabs */}
      <div className="flex border-b border-gray-100 overflow-x-auto">
        {[1, 2, 3, 4].map((term) => (
          <button
            key={term}
            onClick={() => setActiveTerm(term)}
            className={`flex-1 flex-shrink-0 py-2.5 text-sm font-medium transition-colors ${
              activeTerm === term ? "bg-green-700 text-white" : "text-gray-500 hover:bg-gray-50"
            }`}
          >
            Term {term}
          </button>
        ))}
      </div>
      {/* Topic list */}
      <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto">
        {termData?.weeks.map((week) => (
          <button
            key={week.id}
            onClick={() => onSelect(week)}
            className={`w-full text-left px-4 py-3 hover:bg-green-50 transition-colors ${
              selectedId === week.id ? "bg-green-50 border-l-4 border-green-600" : ""
            }`}
          >
            <p className="text-xs text-gray-400 mb-0.5">{formatWeeks(week.weekStart, week.weekEnd)} · {week.topic}</p>
            <p className="text-sm font-medium text-gray-800">{week.subtopic}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

export default function Lessons() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [lessonContent, setLessonContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("misconceptions");
  const [mobileView, setMobileView] = useState("select");

  const handleGenerate = async () => {
    if (!selectedTopic) return;
    setLoading(true);
    setError("");
    setLessonContent("");
    setMobileView("lesson");
    try {
      const content = await generateLesson(selectedTopic);
      setLessonContent(content);
    } catch (e) {
      setError(e.message || "Failed to generate lesson. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-3 sm:p-6 max-w-6xl mx-auto">
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Lesson Generator</h1>
        <p className="text-gray-500 text-sm mt-1">Select a topic to view misconceptions and generate a CAPS-aligned lesson plan</p>
      </div>

      {/* Mobile view toggle */}
      <div className="flex lg:hidden gap-2 mb-4">
        {["select", "info", "lesson"].map((view) => (
          <button
            key={view}
            onClick={() => setMobileView(view)}
            className={`flex-1 py-2 rounded-lg text-xs font-medium transition-colors ${
              mobileView === view ? "bg-green-700 text-white" : "bg-white border border-gray-200 text-gray-600"
            }`}
          >
            {view === "select" ? "📋 Topics" : view === "info" ? "ℹ️ Info" : "📄 Lesson"}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Left panel */}
        <div className={mobileView === "lesson" ? "hidden lg:block" : ""}>

          {/* Topic selector — always show on mobile 'select' view */}
          <div className={mobileView === "info" ? "hidden lg:block" : ""}>
            <h2 className="text-xs font-semibold text-gray-500 uppercase mb-2 tracking-wide">1. Select Topic</h2>
            <TopicSelector onSelect={(t) => { setSelectedTopic(t); setMobileView("info"); }} selectedId={selectedTopic?.id} />
          </div>

          {/* Topic info */}
          {selectedTopic && (
            <div className={`mt-4 ${mobileView === "select" ? "hidden lg:block" : ""}`}>
              <div className={`rounded-xl border p-4 mb-4 ${TOPIC_COLORS[selectedTopic.topic] || "bg-gray-50 border-gray-200"}`}>
                <p className="text-xs text-gray-500 mb-1">{selectedTopic.capsRef}</p>
                <h3 className="font-semibold text-gray-800">{selectedTopic.subtopic}</h3>
                <p className="text-sm text-gray-600 mt-1">{selectedTopic.description}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedTopic.cognitiveLevel.map((l) => {
                    const colors = COGNITIVE_LEVEL_COLORS[l] || {};
                    return (
                      <span key={l} className={`text-xs px-2 py-0.5 rounded font-medium ${colors.bg} ${colors.text}`}>{l}</span>
                    );
                  })}
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1.5 mb-3 overflow-x-auto pb-1">
                {["misconceptions", "methods", "outcomes"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                      activeTab === tab ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    {tab === "misconceptions" ? "⚠️ Misconceptions" : tab === "methods" ? "🎯 Methods" : "📋 Outcomes"}
                  </button>
                ))}
              </div>

              {activeTab === "misconceptions" && (
                <div className="flex flex-col gap-3">
                  {selectedTopic.misconceptions.map((m, i) => <MisconceptionCard key={i} item={m} />)}
                </div>
              )}
              {activeTab === "methods" && (
                <ul className="space-y-2">
                  {selectedTopic.teachingMethods.map((m, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-600 flex-shrink-0">→</span>{m}
                    </li>
                  ))}
                </ul>
              )}
              {activeTab === "outcomes" && (
                <ul className="space-y-2">
                  {selectedTopic.learningOutcomes.map((o, i) => (
                    <li key={i} className="flex gap-2 text-sm text-gray-700">
                      <span className="text-green-600 flex-shrink-0">{i + 1}.</span>{o}
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-4">
                <Button onClick={handleGenerate} disabled={loading} className="w-full justify-center py-3">
                  {loading ? "Preparing..." : "✨ Generate Full Lesson Plan"}
                </Button>
              </div>
            </div>
          )}

          {!selectedTopic && (
            <EmptyState icon="📖" title="Select a topic" description="Choose a topic from the ATP above." />
          )}
        </div>

        {/* Right: Lesson output */}
        <div className={mobileView === "select" || mobileView === "info" ? "hidden lg:block" : ""}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Lesson Plan</h2>
            {lessonContent && (
              <Button variant="secondary" onClick={() => downloadTextFile(lessonContent, `Lesson_${selectedTopic?.subtopic}.txt`)}>
                ⬇ Download
              </Button>
            )}
          </div>
          <div className="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 min-h-64">
            {loading && <LoadingSpinner message="Preparing your lesson plan, please wait..." />}
            {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">{error}</div>}
            {!loading && !error && lessonContent && (
              <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">{lessonContent}</pre>
            )}
            {!loading && !error && !lessonContent && (
              <EmptyState icon="✨" title="Lesson plan will appear here" description="Select a topic and tap Generate." />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
