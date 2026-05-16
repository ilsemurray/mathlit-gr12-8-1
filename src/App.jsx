import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { TeacherProvider } from "./context/TeacherContext";
import { TrackerProvider } from "./context/TrackerContext";
import { QuestionBankProvider } from "./context/QuestionBankContext";
import Sidebar from "./components/layout/Sidebar";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import Assessments from "./pages/Assessments";
import Tracker from "./pages/Tracker";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <TeacherProvider>
      <TrackerProvider>
        <QuestionBankProvider>
          <Router>
            <div className="flex h-screen bg-gray-50 font-sans">
              <Sidebar />
              {/* pt-14 on mobile to clear the fixed top bar */}
              <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/lessons" element={<Lessons />} />
                  <Route path="/assessments" element={<Assessments />} />
                  <Route path="/tracker" element={<Tracker />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </main>
            </div>
          </Router>
        </QuestionBankProvider>
      </TrackerProvider>
    </TeacherProvider>
  );
}
