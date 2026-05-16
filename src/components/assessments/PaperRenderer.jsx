/**
 * PaperRenderer.jsx
 * Renders generated plain-text assessment as a professional NSC document.
 * PDF export uses jsPDF + html2canvas loaded via CDN script tags in index.html.
 */
import { useState, useRef } from "react";

// ── Section splitter ────────────────────────────────────────────
function splitSections(raw) {
  const memoSplit = raw.split(/===MEMORANDUM===/i);
  const paper = memoSplit[0]?.trim() || raw.trim();
  const rest = memoSplit[1] || "";
  const cogSplit = rest.split(/===COGNITIVE LEVEL TABLE===/i);
  const memo = cogSplit[0]?.trim() || "";
  const cogTable = cogSplit[1]?.trim() || "";
  return { paper, memo, cogTable };
}

// ── Parse plain text table into rows ───────────────────────────
function parseTable(text) {
  const rows = [];
  text.split("\n").forEach((line) => {
    if (line.includes("|")) {
      const cells = line.split("|").map((c) => c.trim()).filter(Boolean);
      if (cells.length > 1) rows.push(cells);
    }
  });
  return rows;
}

// ── Render plain text intelligently ─────────────────────────────
function renderLines(text) {
  if (!text) return null;
  return text.split("\n").map((line, i) => {
    const t = line.trim();
    if (!t) return <div key={i} className="h-2" />;

    if (/^QUESTION\s+\d+/i.test(t)) {
      return (
        <div key={i} className="mt-6 mb-2 border-b-2 border-gray-800 pb-1">
          <span className="font-bold text-base uppercase tracking-wide text-gray-900">{t}</span>
        </div>
      );
    }
    if (/^TASK\s+\d+/i.test(t)) {
      return (
        <div key={i} className="mt-5 mb-2">
          <span className="font-bold text-sm uppercase tracking-wide text-gray-800 bg-gray-100 px-2 py-1 rounded">{t}</span>
        </div>
      );
    }
    if (/^(INSTRUCTIONS|INFORMATION|READ THE FOLLOWING|NOTE:|ANSWER ALL|ANNEXURE)/i.test(t)) {
      return <p key={i} className="font-bold text-sm text-gray-800 mt-4 mb-1 uppercase tracking-wide">{t}</p>;
    }
    if (/^\d+\.\d+/.test(t)) {
      const depth = (t.match(/\.\d/g) || []).length;
      const indent = depth >= 2 ? "ml-10" : "ml-5";
      const markMatch = t.match(/\((\d+)\)\s*$/);
      const body = markMatch ? t.slice(0, t.lastIndexOf(markMatch[0])).trim() : t;
      const mark = markMatch ? markMatch[0] : null;
      return (
        <div key={i} className={`flex justify-between items-start gap-3 py-1 ${indent}`}>
          <span className="text-sm text-gray-800 leading-relaxed flex-1">{body}</span>
          {mark && <span className="text-sm font-bold text-gray-700 flex-shrink-0 font-mono">{mark}</span>}
        </div>
      );
    }
    if (/^(total|subtotal|\[total)/i.test(t) || /\[\d+\]\s*$/.test(t)) {
      return <p key={i} className="text-sm font-bold text-gray-800 text-right mt-1 border-t border-gray-300 pt-1">{t}</p>;
    }
    if (/\(\d+\)\s*$/.test(t)) {
      const markMatch = t.match(/\((\d+)\)\s*$/);
      const body = t.slice(0, t.lastIndexOf(markMatch[0])).trim();
      return (
        <div key={i} className="flex justify-between items-start gap-3 py-0.5 ml-5">
          <span className="text-sm text-gray-800 leading-relaxed flex-1">{body}</span>
          <span className="text-sm font-bold text-gray-700 flex-shrink-0 font-mono">{markMatch[0]}</span>
        </div>
      );
    }
    return <p key={i} className="text-sm text-gray-800 leading-relaxed">{t}</p>;
  });
}

// ── Cover Page ──────────────────────────────────────────────────
function CoverPage({ teacher, assessmentType, totalMarks, duration, term }) {
  return (
    <div className="text-center mb-8 pb-8 border-b-4 border-double border-gray-800">
      <div className="border-2 border-gray-800 inline-block px-8 py-4 mb-5">
        <p className="text-2xl font-bold text-gray-900 uppercase tracking-wide">
          {teacher.schoolName || "School Name"}
        </p>
        {teacher.district && <p className="text-sm text-gray-600 mt-1">{teacher.district}</p>}
        {teacher.province && <p className="text-sm text-gray-600">{teacher.province}</p>}
      </div>
      <div className="mb-6">
        <p className="text-2xl font-bold text-gray-900 uppercase tracking-widest">Mathematical Literacy</p>
        <p className="text-lg font-semibold text-gray-700 mt-1">Grade 12</p>
        <p className="text-base text-gray-600 mt-1">{assessmentType}</p>
        <p className="text-sm text-gray-500 mt-0.5">Term {term} · {teacher.year}</p>
      </div>
      <div className="grid grid-cols-2 gap-2 max-w-xs mx-auto text-sm border border-gray-300 rounded p-4 mb-6">
        {[
          ["Total Marks", totalMarks],
          ["Time Allowed", duration],
          ["Examiner", `${teacher.name} ${teacher.surname}`],
          ["Moderator", "_______________"],
        ].map(([label, value]) => (
          <>
            <div key={`l-${label}`} className="text-right font-semibold text-gray-600">{label}:</div>
            <div key={`v-${label}`} className="text-left text-gray-900">{value}</div>
          </>
        ))}
      </div>
      <div className="border border-gray-400 rounded p-4 text-left max-w-md mx-auto mb-6">
        <p className="font-bold text-sm text-gray-800 mb-2 text-center uppercase tracking-wide">
          Instructions to Learners
        </p>
        <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside">
          <li>Read all questions carefully before answering.</li>
          <li>Answer ALL questions unless otherwise instructed.</li>
          <li>Number answers correctly according to the numbering system used in this paper.</li>
          <li>Clearly show ALL calculations, diagrams and graphs used in determining the answers.</li>
          <li>An approved non-programmable and non-graphical calculator may be used.</li>
          <li>Round off ALL final answers appropriately according to the given context.</li>
          <li>Units of measurement MUST be indicated where applicable.</li>
          <li>Maps and diagrams are NOT necessarily drawn to scale.</li>
          <li>Write neatly and legibly.</li>
        </ol>
      </div>
      <div className="flex justify-between text-sm text-gray-700 max-w-sm mx-auto border-t border-gray-300 pt-4">
        <span>Name: _________________________</span>
        <span>Date: ______________</span>
      </div>
    </div>
  );
}

// ── Cognitive Level Table ───────────────────────────────────────
function CogTable({ text }) {
  if (!text) return null;
  const rows = parseTable(text);
  if (!rows.length) return <pre className="text-xs text-gray-700 whitespace-pre-wrap">{text}</pre>;
  const [header, ...body] = rows;
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-xs border-collapse border border-gray-400">
        <thead>
          <tr className="bg-green-800 text-white">
            {header.map((cell, i) => (
              <th key={i} className="border border-gray-400 px-2 py-1.5 text-left font-semibold">{cell}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, i) => {
            const isFooter = row[0]?.match(/total|%|percent/i);
            return (
              <tr key={i} className={isFooter ? "bg-green-50 font-bold" : i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                {row.map((cell, j) => (
                  <td key={j} className="border border-gray-300 px-2 py-1.5 text-gray-800">{cell}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2">
        {[["L1 Knowledge","~30%"],["L2 Routine Procedures","~30%"],["L3 Complex Procedures","~20%"],["L4 Reasoning","~20%"]].map(([l,p]) => (
          <div key={l} className="bg-green-50 border border-green-200 rounded p-2 text-center">
            <p className="text-xs font-bold text-green-800">{p}</p>
            <p className="text-xs text-green-700">{l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── PDF Export using window globals from CDN scripts in index.html ──
async function exportToPDF(contentRef, filename, sectionLabel) {
  // jsPDF and html2canvas are loaded as global scripts in index.html
  const jsPDFLib = window.jspdf || window.jsPDF;
  const html2canvas = window.html2canvas;

  if (!jsPDFLib || !html2canvas) {
    throw new Error("PDF libraries not loaded. Please refresh the page and try again.");
  }

  const { jsPDF } = jsPDFLib;
  const element = contentRef.current;
  if (!element) throw new Error("Nothing to export.");

  // Render at A4 width (794px ≈ A4 at 96dpi)
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    logging: false,
    windowWidth: 850,
    backgroundColor: "#ffffff",
  });

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = 210;
  const pageH = 297;
  const margin = 12;
  const contentW = pageW - margin * 2;
  const contentH = pageH - margin * 2 - 8; // 8mm reserved for page number

  const imgData = canvas.toDataURL("image/jpeg", 0.95);
  const totalImgH = (canvas.height * contentW) / canvas.width;

  let position = 0;
  let page = 1;

  while (position < totalImgH) {
    if (page > 1) pdf.addPage();

    // Draw image shifted up by position
    pdf.addImage(
      imgData, "JPEG",
      margin,
      margin - position,
      contentW,
      totalImgH
    );

    // White mask to hide overflow below page content area
    pdf.setFillColor(255, 255, 255);
    pdf.rect(0, margin + contentH, pageW, pageH, "F");
    // White mask top (for pages > 1, hide content above margin)
    if (page > 1) {
      pdf.rect(0, 0, pageW, margin, "F");
    }

    // Page number footer (skip cover page = page 1)
    if (page > 1) {
      pdf.setFontSize(8);
      pdf.setTextColor(120, 120, 120);
      pdf.text(`Page ${page - 1}`, pageW / 2, pageH - 5, { align: "center" });
      pdf.text(sectionLabel, margin, pageH - 5);
    }

    position += contentH;
    page++;
  }

  const pdfFilename = filename.replace(/\.(txt|pdf)$/, "") + `_${sectionLabel.replace(/[^a-zA-Z]/g, "")}.pdf`;
  pdf.save(pdfFilename);
}

// ── Main PaperRenderer ──────────────────────────────────────────
export default function PaperRenderer({ rawText, teacher, assessmentType, totalMarks, duration, term, filename }) {
  const [activeSection, setActiveSection] = useState("paper");
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const contentRef = useRef(null);

  const { paper, memo, cogTable } = splitSections(rawText);

  const sections = [
    { id: "paper", label: "📄 Question Paper", has: !!paper },
    { id: "memo", label: "📋 Memorandum", has: !!memo },
    { id: "cog", label: "📊 Cognitive Levels", has: !!cogTable },
  ].filter((s) => s.has);

  const activeSectionLabel = sections.find((s) => s.id === activeSection)?.label?.replace(/📄|📋|📊/g, "").trim() || "Paper";

  const handleExportPDF = async () => {
    setExporting(true);
    setExportError("");
    try {
      await exportToPDF(contentRef, filename, activeSectionLabel);
    } catch (e) {
      setExportError(e.message || "PDF export failed. Please try again.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex gap-1.5 flex-wrap">
          {sections.map((s) => (
            <button key={s.id} onClick={() => { setActiveSection(s.id); setExportError(""); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                activeSection === s.id ? "bg-green-700 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {s.label}
            </button>
          ))}
        </div>
        <button
          onClick={handleExportPDF}
          disabled={exporting}
          className="text-xs bg-green-700 text-white px-4 py-1.5 rounded-lg font-medium hover:bg-green-800 disabled:opacity-50 transition-colors"
        >
          {exporting ? "Exporting..." : "⬇ Download PDF"}
        </button>
      </div>

      {exportError && (
        <div className="mb-3 bg-red-50 border border-red-200 rounded-lg p-3 text-xs text-red-700">
          {exportError}
        </div>
      )}

      {/* Paper */}
      <div
        ref={contentRef}
        className="bg-white border border-gray-300 rounded-xl shadow-sm overflow-hidden"
        style={{ fontFamily: "Arial, Helvetica, sans-serif" }}
      >
        <div className="h-2 bg-green-800" />
        <div className="p-6 sm:p-10">
          {activeSection === "paper" && (
            <>
              <CoverPage teacher={teacher} assessmentType={assessmentType} totalMarks={totalMarks} duration={duration} term={term} />
              <div className="text-right text-xs text-gray-400 mb-4 border-t border-gray-200 pt-2">Page 1</div>
              {renderLines(paper)}
            </>
          )}
          {activeSection === "memo" && (
            <>
              <div className="text-center mb-8 pb-4 border-b-2 border-gray-800">
                <p className="text-xl font-bold uppercase tracking-widest text-gray-900">Memorandum</p>
                <p className="text-sm text-gray-600 mt-1">{teacher.schoolName} · Grade 12 Mathematical Literacy · {assessmentType}</p>
                <div className="mt-2 inline-block bg-red-700 text-white text-xs font-bold px-4 py-1 rounded uppercase tracking-widest">
                  Strictly Confidential — Not for Learner Distribution
                </div>
              </div>
              {renderLines(memo)}
            </>
          )}
          {activeSection === "cog" && (
            <>
              <div className="text-center mb-6 pb-4 border-b-2 border-gray-800">
                <p className="text-lg font-bold uppercase tracking-wide text-gray-900">Cognitive Level Summary</p>
                <p className="text-sm text-gray-500 mt-1">CAPS Alignment · {assessmentType} · {teacher.schoolName}</p>
              </div>
              <CogTable text={cogTable} />
            </>
          )}
        </div>
        <div className="h-1 bg-green-800" />
      </div>
    </div>
  );
}
