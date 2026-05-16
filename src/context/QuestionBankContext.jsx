import { createContext, useContext, useState } from "react";
import { DEFAULT_EXEMPLAR } from "../data/defaultExemplar";

const QuestionBankContext = createContext(null);

// Extract readable text from PDF or Word files
async function extractText(file) {
  const name = file.name.toLowerCase();
  if (name.endsWith(".txt") || file.type === "text/plain") {
    return await file.text();
  }
  // PDF and Word — extract readable ASCII text from binary
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const raw = e.target.result || "";
      let text = "";
      for (let i = 0; i < raw.length; i++) {
        const code = raw.charCodeAt(i);
        if ((code >= 32 && code < 127) || code === 10 || code === 13) {
          text += raw[i];
        }
      }
      text = text.replace(/\s{3,}/g, "\n").trim();
      if (text.length < 80) {
        reject(new Error("Could not extract enough text from this file. Try saving it as a PDF and uploading again."));
      } else {
        resolve(text);
      }
    };
    reader.onerror = () => reject(new Error("Failed to read file."));
    reader.readAsBinaryString(file);
  });
}

function emptyState() {
  return { text: "", fileName: "", loading: false, error: "" };
}

export function QuestionBankProvider({ children }) {
  const [bank, setBank] = useState(emptyState());
  const [exemplar, setExemplar] = useState(emptyState());

  const upload = async (file, setter) => {
    setter({ text: "", fileName: "", loading: true, error: "" });
    try {
      const text = await extractText(file);
      setter({ text, fileName: file.name, loading: false, error: "" });
    } catch (e) {
      setter({ text: "", fileName: "", loading: false, error: e.message });
    }
  };

  const uploadQuestionBank = (file) => upload(file, setBank);
  const clearQuestionBank = () => setBank(emptyState());

  const uploadExemplar = (file) => upload(file, setExemplar);
  const clearExemplar = () => setExemplar(emptyState());

  /**
   * Build the combined context string for the AI.
   * - If teacher uploaded an exemplar → use that (overrides default)
   * - If no exemplar uploaded → use the built-in default format guide
   * - Question bank is always appended if present
   */
  const buildExtraContext = () => {
    const parts = [];

    const exemplarText = exemplar.text || DEFAULT_EXEMPLAR;
    const exemplarLabel = exemplar.text
      ? "EXEMPLAR PAPER (copy this exact format, layout, spacing, font style, numbering, and alignment):"
      : "FORMAT REQUIREMENTS (follow these exactly for layout, numbering, spacing, and alignment):";

    parts.push(`${exemplarLabel}\n${exemplarText.slice(0, 8000)}`);

    if (bank.text) {
      parts.push(
        `QUESTION BANK REFERENCE (use for question style and difficulty level only — do not copy questions verbatim):\n${bank.text.slice(0, 5000)}`
      );
    }

    return parts.join("\n\n");
  };

  return (
    <QuestionBankContext.Provider value={{
      // Question bank
      questionBankText: bank.text,
      questionBankFileName: bank.fileName,
      questionBankLoading: bank.loading,
      questionBankError: bank.error,
      hasQuestionBank: !!bank.text,
      uploadQuestionBank,
      clearQuestionBank,
      // Exemplar
      exemplarText: exemplar.text,
      exemplarFileName: exemplar.fileName,
      exemplarLoading: exemplar.loading,
      exemplarError: exemplar.error,
      hasExemplar: !!exemplar.text,
      usingDefaultExemplar: !exemplar.text,
      uploadExemplar,
      clearExemplar,
      // Combined context
      buildExtraContext,
    }}>
      {children}
    </QuestionBankContext.Provider>
  );
}

export function useQuestionBank() {
  const context = useContext(QuestionBankContext);
  if (!context) throw new Error("useQuestionBank must be used within QuestionBankProvider");
  return context;
}
