import { useRef } from "react";
import { useQuestionBank } from "../../context/QuestionBankContext";

export default function QuestionBankUploader() {
  const {
    hasQuestionBank, questionBankFileName, questionBankLoading, questionBankError,
    uploadQuestionBank, clearQuestionBank,
    hasExemplar, exemplarFileName, exemplarLoading, exemplarError,
    usingDefaultExemplar, uploadExemplar, clearExemplar,
  } = useQuestionBank();

  const bankRef = useRef(null);
  const exemplarRef = useRef(null);

  // Only PDF and Word — no .txt
  const ACCEPT = ".pdf,.doc,.docx";

  return (
    <div className="mb-5 space-y-3">
      <label className="text-xs font-semibold text-gray-500 uppercase block">
        Reference Documents (optional)
      </label>

      {/* ── Exemplar Paper ── */}
      <div>
        <p className="text-xs text-gray-600 font-medium mb-1">
          📄 Exemplar Paper <span className="text-gray-400 font-normal">(for format &amp; layout)</span>
        </p>

        {/* Default exemplar indicator */}
        {usingDefaultExemplar && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 mb-1.5">
            <p className="text-xs font-semibold text-blue-800">✅ Using built-in NSC format</p>
            <p className="text-xs text-blue-600">Upload your own paper below to override this</p>
          </div>
        )}

        {!hasExemplar && !exemplarLoading && (
          <div
            onClick={() => exemplarRef.current?.click()}
            className="border-2 border-dashed border-blue-200 rounded-lg p-3 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
          >
            <p className="text-xs text-gray-500">Upload your own paper to use its format</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF or Word (.docx) only</p>
            <input ref={exemplarRef} type="file" accept={ACCEPT} onChange={(e) => {
              const f = e.target.files?.[0]; if (f) uploadExemplar(f); e.target.value = "";
            }} className="hidden" />
          </div>
        )}
        {exemplarLoading && <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2">Reading file...</p>}
        {exemplarError && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">⚠️ {exemplarError}</p>}
        {hasExemplar && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-blue-800">✅ {exemplarFileName}</p>
              <p className="text-xs text-blue-600">Your paper format will be used (overrides default)</p>
            </div>
            <button onClick={clearExemplar} className="text-xs text-red-500 hover:text-red-700 ml-2 flex-shrink-0">
              Remove
            </button>
          </div>
        )}
      </div>

      {/* ── Question Bank ── */}
      <div>
        <p className="text-xs text-gray-600 font-medium mb-1">
          📚 Question Bank <span className="text-gray-400 font-normal">(past papers for reference)</span>
        </p>
        {!hasQuestionBank && !questionBankLoading && (
          <div
            onClick={() => bankRef.current?.click()}
            className="border-2 border-dashed border-gray-300 rounded-lg p-3 text-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
          >
            <p className="text-xs text-gray-500">Upload past papers as question reference</p>
            <p className="text-xs text-gray-400 mt-0.5">PDF or Word (.docx) only</p>
            <input ref={bankRef} type="file" accept={ACCEPT} onChange={(e) => {
              const f = e.target.files?.[0]; if (f) uploadQuestionBank(f); e.target.value = "";
            }} className="hidden" />
          </div>
        )}
        {questionBankLoading && <p className="text-xs text-blue-600 bg-blue-50 rounded-lg p-2">Reading file...</p>}
        {questionBankError && <p className="text-xs text-red-600 bg-red-50 rounded-lg p-2">⚠️ {questionBankError}</p>}
        {hasQuestionBank && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-2 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-green-800">✅ {questionBankFileName}</p>
              <p className="text-xs text-green-600">Used as question style and difficulty reference</p>
            </div>
            <button onClick={clearQuestionBank} className="text-xs text-red-500 hover:text-red-700 ml-2 flex-shrink-0">
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
