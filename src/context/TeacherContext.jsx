import { createContext, useContext, useState, useEffect } from "react";

const TeacherContext = createContext(null);

const DEFAULT_TEACHER = {
  name: "",
  surname: "",
  schoolName: "",
  district: "",
  province: "",
  grade: "12",
  subject: "Mathematical Literacy",
  year: new Date().getFullYear().toString(),
};

export function TeacherProvider({ children }) {
  const [teacher, setTeacher] = useState(() => {
    try {
      const saved = localStorage.getItem("ml_teacher_profile");
      return saved ? JSON.parse(saved) : DEFAULT_TEACHER;
    } catch {
      return DEFAULT_TEACHER;
    }
  });

  useEffect(() => {
    localStorage.setItem("ml_teacher_profile", JSON.stringify(teacher));
  }, [teacher]);

  const updateTeacher = (updates) => {
    setTeacher((prev) => ({ ...prev, ...updates }));
  };

  const isProfileComplete = !!(teacher.name && teacher.surname && teacher.schoolName);

  return (
    <TeacherContext.Provider value={{ teacher, updateTeacher, isProfileComplete }}>
      {children}
    </TeacherContext.Provider>
  );
}

export function useTeacher() {
  const context = useContext(TeacherContext);
  if (!context) throw new Error("useTeacher must be used within TeacherProvider");
  return context;
}
