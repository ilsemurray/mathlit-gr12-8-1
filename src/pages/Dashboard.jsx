import { useTracker } from "../context/TrackerContext";
import { useTeacher } from "../context/TeacherContext";
import { ATP } from "../data/capsTopics";
import { Link } from "react-router-dom";

function StatCard({ label, value, sub, color = "green" }) {
  const colors = {
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
    orange: "bg-orange-50 border-orange-200 text-orange-700",
    purple: "bg-purple-50 border-purple-200 text-purple-700",
  };
  return (
    <div className={`rounded-xl border p-4 ${colors[color]}`}>
      <p className="text-xs font-medium opacity-75">{label}</p>
      <p className="text-2xl sm:text-3xl font-bold mt-1">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
}

export default function Dashboard() {
  const { teacher, isProfileComplete } = useTeacher();
  const { overallProgress, termProgress, taughtTopics } = useTracker();
  const totalTopics = ATP.reduce((s, t) => s + t.weeks.length, 0);

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
          {isProfileComplete ? `Welcome, ${teacher.name} ${teacher.surname}` : "Welcome"}
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          {isProfileComplete
            ? `${teacher.schoolName} · Grade 12 Mathematical Literacy`
            : "Set up your profile in Settings to get started"}
        </p>
      </div>

      {/* Profile warning */}
      {!isProfileComplete && (
        <div className="mb-5 bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-start gap-3">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <p className="font-semibold text-yellow-800 text-sm">Profile incomplete</p>
            <p className="text-xs text-yellow-700 mt-0.5">
              Add your name and school in{" "}
              <Link to="/settings" className="underline font-medium">Settings</Link>{" "}
              so your assessments have the correct credentials.
            </p>
          </div>
        </div>
      )}

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <StatCard label="Overall" value={`${overallProgress}%`} sub={`${taughtTopics.length}/${totalTopics} topics`} color="green" />
        <StatCard label="Term 1" value={`${termProgress[1]}%`} color="blue" />
        <StatCard label="Term 2" value={`${termProgress[2]}%`} color="orange" />
        <StatCard label="Term 3 & 4" value={`${Math.round((termProgress[3] + termProgress[4]) / 2)}%`} color="purple" />
      </div>

      {/* Progress by term */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 mb-5">
        <h2 className="font-semibold text-gray-800 mb-4 text-sm sm:text-base">ATP Progress by Term</h2>
        {[1, 2, 3, 4].map((term) => (
          <div key={term} className="mb-3">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
              <span>Term {term}</span>
              <span className="font-medium">{termProgress[term]}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5">
              <div
                className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                style={{ width: `${termProgress[term]}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {[
          { to: "/tracker", icon: "✅", title: "Update ATP Tracker", desc: "Mark topics as taught" },
          { to: "/lessons", icon: "📖", title: "Generate a Lesson", desc: "AI-powered CAPS lesson plans" },
          { to: "/assessments", icon: "📝", title: "Create Assessment", desc: "Tests, exams, investigations" },
        ].map(({ to, icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-400 hover:shadow-sm transition-all group flex sm:flex-col items-center sm:items-start gap-3"
          >
            <div className="text-2xl sm:text-3xl sm:mb-1">{icon}</div>
            <div>
              <h3 className="font-semibold text-gray-800 text-sm group-hover:text-green-700">{title}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
