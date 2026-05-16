// South African provinces
export const SA_PROVINCES = [
  "Eastern Cape",
  "Free State",
  "Gauteng",
  "KwaZulu-Natal",
  "Limpopo",
  "Mpumalanga",
  "North West",
  "Northern Cape",
  "Western Cape",
];

// Assessment types matching CAPS formal programme
export const ASSESSMENT_TYPES = [
  { value: "control_test", label: "Control Test", marks: 50, duration: "1 hour" },
  { value: "mid_year_exam_p1", label: "Mid-Year Exam – Paper 1", marks: 75, duration: "1.5 hours" },
  { value: "mid_year_exam_p2", label: "Mid-Year Exam – Paper 2", marks: 75, duration: "1.5 hours" },
  { value: "trial_exam_p1", label: "Trial Exam – Paper 1", marks: 75, duration: "1.5 hours" },
  { value: "trial_exam_p2", label: "Trial Exam – Paper 2", marks: 75, duration: "1.5 hours" },
  { value: "investigation", label: "Investigation", marks: 50, duration: "1-2 weeks" },
  { value: "assignment", label: "Assignment", marks: 50, duration: "1 week" },
];

export const TERMS = [1, 2, 3, 4];

export const COGNITIVE_LEVEL_COLORS = {
  L1: { bg: "bg-blue-100", text: "text-blue-800", border: "border-blue-200" },
  L2: { bg: "bg-green-100", text: "text-green-800", border: "border-green-200" },
  L3: { bg: "bg-yellow-100", text: "text-yellow-800", border: "border-yellow-200" },
  L4: { bg: "bg-red-100", text: "text-red-800", border: "border-red-200" },
};

export const TOPIC_COLORS = {
  "Finance": "bg-emerald-50 border-emerald-200",
  "Measurement": "bg-blue-50 border-blue-200",
  "Maps, Plans and Other Representations of the Physical World": "bg-purple-50 border-purple-200",
  "Data Handling": "bg-orange-50 border-orange-200",
  "Probability": "bg-pink-50 border-pink-200",
  "Patterns, Relationships and Representations": "bg-teal-50 border-teal-200",
  "Numbers and Calculations with Numbers": "bg-gray-50 border-gray-200",
};
