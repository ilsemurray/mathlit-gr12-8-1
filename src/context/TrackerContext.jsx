import { createContext, useContext, useState, useEffect } from "react";
import { ATP } from "../data/capsTopics";

const TrackerContext = createContext(null);

// A unique ID for each learning outcome: "topicId__0", "topicId__1" etc.
export function outcomeId(topicId, index) {
  return `${topicId}__${index}`;
}

// Get all outcome IDs for a topic
export function getOutcomeIds(week) {
  return (week.learningOutcomes || []).map((_, i) => outcomeId(week.id, i));
}

// Progress helpers
function calcOverallProgress(state) {
  let total = 0, done = 0;
  ATP.forEach((term) => term.weeks.forEach((week) => {
    const ids = getOutcomeIds(week);
    total += ids.length;
    done += ids.filter((id) => state[id]).length;
  }));
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

function calcTermProgress(termNum, state) {
  const term = ATP.find((t) => t.term === termNum);
  if (!term) return 0;
  let total = 0, done = 0;
  term.weeks.forEach((week) => {
    const ids = getOutcomeIds(week);
    total += ids.length;
    done += ids.filter((id) => state[id]).length;
  });
  return total === 0 ? 0 : Math.round((done / total) * 100);
}

// Returns subtopics where at least one outcome is taught
function calcTaughtTopics(state) {
  const taught = [];
  ATP.forEach((term) => {
    term.weeks.forEach((week) => {
      const ids = getOutcomeIds(week);
      const taughtCount = ids.filter((id) => state[id]).length;
      if (taughtCount > 0) {
        taught.push({
          ...week,
          term: term.term,
          taughtOutcomes: taughtCount,
          totalOutcomes: ids.length,
          // outcomes with their taught status for the assessment generator
          outcomes: (week.learningOutcomes || []).map((text, i) => ({
            text,
            id: outcomeId(week.id, i),
            taught: !!state[outcomeId(week.id, i)],
          })),
        });
      }
    });
  });
  return taught;
}

export function TrackerProvider({ children }) {
  const [trackerState, setTrackerState] = useState(() => {
    try {
      const saved = localStorage.getItem("ml_tracker_state_v2");
      return saved ? JSON.parse(saved) : {};
    } catch { return {}; }
  });

  useEffect(() => {
    localStorage.setItem("ml_tracker_state_v2", JSON.stringify(trackerState));
  }, [trackerState]);

  const toggleOutcome = (id) =>
    setTrackerState((prev) => ({ ...prev, [id]: !prev[id] }));

  const isOutcomeTaught = (id) => !!trackerState[id];

  // Check if all outcomes in a subtopic are taught
  const isTopicFullyTaught = (week) =>
    getOutcomeIds(week).every((id) => !!trackerState[id]);

  // Check if some (but not all) outcomes are taught — for indeterminate state
  const isTopicPartiallyTaught = (week) => {
    const ids = getOutcomeIds(week);
    const doneCount = ids.filter((id) => !!trackerState[id]).length;
    return doneCount > 0 && doneCount < ids.length;
  };

  // Toggle ALL outcomes in a subtopic at once
  const toggleAllOutcomes = (week) => {
    const ids = getOutcomeIds(week);
    const allDone = ids.every((id) => !!trackerState[id]);
    setTrackerState((prev) => {
      const next = { ...prev };
      ids.forEach((id) => { next[id] = !allDone; });
      return next;
    });
  };

  // Count taught outcomes for a topic
  const countTaughtOutcomes = (week) =>
    getOutcomeIds(week).filter((id) => !!trackerState[id]).length;

  const overallProgress = calcOverallProgress(trackerState);
  const taughtTopics = calcTaughtTopics(trackerState);
  const termProgress = {
    1: calcTermProgress(1, trackerState),
    2: calcTermProgress(2, trackerState),
    3: calcTermProgress(3, trackerState),
    4: calcTermProgress(4, trackerState),
  };

  return (
    <TrackerContext.Provider value={{
      trackerState,
      toggleOutcome,
      toggleAllOutcomes,
      isOutcomeTaught,
      isTopicFullyTaught,
      isTopicPartiallyTaught,
      countTaughtOutcomes,
      overallProgress,
      taughtTopics,
      termProgress,
    }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const context = useContext(TrackerContext);
  if (!context) throw new Error("useTracker must be used within TrackerProvider");
  return context;
}
