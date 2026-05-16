import { useState } from "react";
import { useTeacher } from "../context/TeacherContext";
import { useTracker } from "../context/TrackerContext";
import PageWrapper from "../components/layout/PageWrapper";
import Button from "../components/shared/Button";
import { SA_PROVINCES } from "../utils/constants";

export default function Settings() {
  const { teacher, updateTeacher } = useTeacher();
  const { trackerState } = useTracker();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({ ...teacher });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    updateTeacher(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleResetTracker = () => {
    if (confirm("Are you sure you want to reset all tracker progress? This cannot be undone.")) {
      localStorage.removeItem("ml_tracker_state");
      window.location.reload();
    }
  };

  return (
    <PageWrapper title="Settings" subtitle="Manage your teacher profile and application preferences">
      <div className="max-w-2xl">
        {/* Teacher Profile */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-4">Teacher Credentials</h2>
          <p className="text-sm text-gray-500 mb-5">These details appear on all generated assessments and lesson plans.</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "First Name", name: "name", placeholder: "e.g. Nomsa" },
              { label: "Surname", name: "surname", placeholder: "e.g. Dlamini" },
            ].map(({ label, name, placeholder }) => (
              <div key={name}>
                <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">{label}</label>
                <input
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
                />
              </div>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">School Name</label>
            <input
              name="schoolName"
              value={form.schoolName}
              onChange={handleChange}
              placeholder="e.g. Soweto Secondary School"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">District</label>
              <input
                name="district"
                value={form.district}
                onChange={handleChange}
                placeholder="e.g. Johannesburg West"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Province</label>
              <select
                name="province"
                value={form.province}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
              >
                <option value="">— Select Province —</option>
                {SA_PROVINCES.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <div className="mt-4">
            <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Academic Year</label>
            <input
              name="year"
              value={form.year}
              onChange={handleChange}
              placeholder="e.g. 2025"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:outline-none focus:border-green-500"
              maxLength={4}
            />
          </div>

          <div className="mt-6 flex items-center gap-3">
            <Button onClick={handleSave}>Save Profile</Button>
            {saved && <span className="text-green-600 text-sm font-medium">✓ Saved!</span>}
          </div>
        </div>

        {/* Assessment Preview */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">Assessment Header Preview</h2>
          <div className="border-2 border-gray-800 rounded-lg p-5 font-serif text-sm">
            <div className="text-center border-b border-gray-300 pb-4 mb-4">
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Republic of South Africa</p>
              <p className="font-bold text-lg">{form.schoolName || "Your School Name"}</p>
              {form.district && <p className="text-sm text-gray-600">{form.district} District</p>}
              {form.province && <p className="text-sm text-gray-600">{form.province}</p>}
            </div>
            <div className="text-center">
              <p className="font-bold text-base uppercase tracking-wide">Mathematical Literacy</p>
              <p className="text-sm">Grade 12 · {form.year}</p>
              <p className="text-sm mt-1">Teacher: {form.name || "First Name"} {form.surname || "Surname"}</p>
            </div>
          </div>
        </div>

        {/* Danger zone */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
          <h2 className="font-semibold text-red-800 mb-1">Danger Zone</h2>
          <p className="text-sm text-red-600 mb-3">Reset your ATP tracker progress. This cannot be undone.</p>
          <Button variant="danger" onClick={handleResetTracker}>Reset ATP Tracker</Button>
        </div>
      </div>
    </PageWrapper>
  );
}
