import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useTracker } from "../../context/TrackerContext";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: "🏠" },
  { to: "/tracker", label: "ATP Tracker", icon: "✅" },
  { to: "/lessons", label: "Lessons", icon: "📖" },
  { to: "/assessments", label: "Assessments", icon: "📝" },
  { to: "/settings", label: "Settings", icon: "⚙️" },
];

export default function Sidebar() {
  const { overallProgress } = useTracker();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-green-900 text-white flex items-center justify-between px-4 py-3 shadow-md">
        <div>
          <p className="font-bold text-sm leading-tight">ML Grade 12</p>
          <p className="text-green-300 text-xs">CAPS Teacher Assistant</p>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white text-2xl leading-none w-9 h-9 flex items-center justify-center rounded-lg hover:bg-green-700 transition-colors"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </div>

      {/* ── Mobile overlay ── */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black bg-opacity-50"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* ── Sidebar (desktop: always visible, mobile: drawer) ── */}
      <aside
        className={`
          fixed lg:static top-0 left-0 h-full z-40
          w-64 bg-green-900 text-white flex flex-col
          transition-transform duration-300
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="p-5 border-b border-green-700 hidden lg:block">
          <h1 className="text-lg font-bold leading-tight">ML Grade 12</h1>
          <p className="text-green-300 text-xs mt-1">CAPS Teacher Assistant</p>
        </div>

        {/* Spacer for mobile top bar */}
        <div className="h-[56px] lg:hidden flex-shrink-0" />

        {/* Progress */}
        <div className="px-5 py-4 border-b border-green-700">
          <p className="text-xs text-green-300 mb-2">ATP Progress</p>
          <div className="w-full bg-green-800 rounded-full h-2">
            <div
              className="bg-green-400 h-2 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <p className="text-xs text-green-300 mt-1">{overallProgress}% complete</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-5 py-3.5 text-sm transition-colors ${
                  isActive
                    ? "bg-green-700 text-white font-semibold"
                    : "text-green-200 hover:bg-green-800 hover:text-white"
                }`
              }
            >
              <span className="text-base">{icon}</span>
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-5 border-t border-green-700 text-xs text-green-400">
          <p>Mathematical Literacy</p>
          <p>Grade 12 · CAPS Aligned</p>
        </div>
      </aside>
    </>
  );
}
