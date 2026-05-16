/**
 * gemini.js — All generation calls
 * Model: gemini-2.5-flash
 */

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

function friendlyError(status, technicalMessage = "") {
  const msg = technicalMessage.toLowerCase();
  if (!navigator.onLine) return "No internet connection. Please check your connection and try again.";
  if (status === 401 || status === 403 || msg.includes("api key") || msg.includes("permission"))
    return "The app is not authorised to generate content right now. Please contact your administrator.";
  if (status === 429 || msg.includes("quota") || msg.includes("rate limit") || msg.includes("resource exhausted"))
    return "The app has reached its daily generation limit. Please try again tomorrow or contact your administrator.";
  if (status === 503 || status === 502 || msg.includes("unavailable") || msg.includes("overloaded"))
    return "The generation service is temporarily busy. Please wait a moment and try again.";
  if (msg.includes("no longer available") || msg.includes("deprecated") || msg.includes("not found"))
    return "A configuration update is needed. Please contact your administrator.";
  if (status >= 500) return "Something went wrong on our end. Please try again in a few minutes.";
  return "Document preparation failed. Please check your internet connection and try again.";
}

async function callGemini(systemPrompt, userPrompt, extraContext = "") {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) throw new Error("The app is not fully set up yet. Please contact your administrator.");

  const fullPrompt = [systemPrompt, userPrompt, extraContext].filter(Boolean).join("\n\n");

  let response;
  try {
    response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: 0.4,
          maxOutputTokens: 65536,
        },
      }),
    });
  } catch {
    throw new Error("Could not reach the generation service. Please check your internet connection and try again.");
  }

  if (!response.ok) {
    let technicalMessage = "";
    try { const err = await response.json(); technicalMessage = err?.error?.message || ""; } catch {}
    throw new Error(friendlyError(response.status, technicalMessage));
  }

  let data;
  try { data = await response.json(); } catch {
    throw new Error("Received an unexpected response. Please try again.");
  }

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No content was generated. Please try again or adjust your selection.");
  return text;
}

// ─── Shared system prompt for all assessment generation ──────────
const EXAMINER_SYSTEM = `You are a senior South African Mathematical Literacy examiner with 20+ years of NSC exam writing experience. You write papers that exactly match the official NSC controlled test format used by the Department of Basic Education.

CRITICAL OUTPUT RULES — YOU MUST FOLLOW ALL OF THESE EXACTLY:
1. Do NOT use markdown. No **, no ##, no --, no asterisks, no | table | pipes anywhere.
2. Use PLAIN TEXT ONLY. Structure with spacing, indentation, and UPPERCASE headings.
3. Write out EVERY question in FULL. Never truncate, summarise, or say "continue as above".
4. Every sub-question must be completely written with its full context and mark allocation.
5. The paper must be 100% complete before you output the memorandum.
6. Use South African contexts: Rands (R), SA provinces, real SA scenarios.
7. Separate sections with exactly: ===MEMORANDUM=== and ===COGNITIVE LEVEL TABLE===

NSC PAPER STRUCTURE TO FOLLOW EXACTLY:
- Start with: Copyright reserved (left) | Please turn over (right)
- Then cover page: school name in box, GRADE 12, assessment type, subject, date, marks, time
- Then: INSTRUCTIONS AND INFORMATION with exactly 10 numbered points
- Then each QUESTION on a new page with header: Mathematical Literacy [page#] NDE/[Month Year]
- Sub-header on every page: FET-Grade 12
- Footer on every page: Copyright reserved (left) | Please turn over (right)
- Questions numbered: QUESTION 1, QUESTION 2, QUESTION 3
- Sub-questions: 1.1, 1.2 | Sub-sub-questions: 1.1.1, 1.1.2
- Mark allocation in round brackets at end of each line: (2) (3) (5) (7)
- Question total in square brackets: [35]
- Grand total at end: TOTAL MARKS [X]
- Currency format: R74 800 (space as thousands separator)
- Tables labelled: TABLE 1: DESCRIPTION, TABLE 2: DESCRIPTION
- End with: ===MEMORANDUM=== then ===COGNITIVE LEVEL TABLE===`;

// ─── LESSON GENERATION ──────────────────────────────────────────
export async function generateLesson(topic) {
  const system = `You are an expert South African Mathematical Literacy teacher. Write detailed lesson plans in plain text only — no markdown symbols, no asterisks, no ## headings. Use CAPS HEADINGS and spacing for structure.`;

  const user = `Write a complete lesson plan for Grade 12 Mathematical Literacy.

Topic: ${topic.topic}
Subtopic: ${topic.subtopic}
CAPS Reference: ${topic.capsRef}
Duration: ${topic.duration}
Cognitive Levels: ${topic.cognitiveLevel.join(", ")}

Learning Outcomes:
${topic.learningOutcomes.map((o, i) => `${i + 1}. ${o}`).join("\n")}

Include these sections, fully written out:
1. LESSON INTRODUCTION
2. PRIOR KNOWLEDGE ACTIVATION
3. MAIN CONTENT WITH EXPLANATIONS
4. WORKED EXAMPLES (minimum 3, at different cognitive levels, with full solutions)
5. CLASSWORK ACTIVITY (5-8 questions)
6. HOMEWORK (3-5 questions)
7. LESSON CLOSURE AND KEY TAKEAWAYS

Use realistic South African examples (Rands, SA places, relatable scenarios).`;

  return callGemini(system, user);
}

// ─── TOPIC ASSESSMENT ───────────────────────────────────────────
export async function generateTopicAssessment(topic, teacher, extraContext = "") {
  const outcomeList = (topic.learningOutcomes || []).map((o, i) => `${i + 1}. ${o}`).join("\n");

  const user = `Generate a COMPLETE topic assessment for Grade 12 Mathematical Literacy.

TEACHER: ${teacher.name} ${teacher.surname}
SCHOOL: ${teacher.schoolName}${teacher.district ? ` | ${teacher.district}` : ""}${teacher.province ? ` | ${teacher.province}` : ""}
YEAR: ${teacher.year}

TOPIC: ${topic.topic}
SUBTOPIC: ${topic.subtopic}
CAPS REFERENCE: ${topic.capsRef}

OUTCOMES BEING ASSESSED:
${outcomeList}

REQUIREMENTS:
- Total marks: 50
- Time: 1 hour
- Cognitive levels: L1 (30%), L2 (30%), L3 (20%), L4 (20%)
- 2 questions minimum, sub-questions 1.1, 1.1.1 etc
- Mark allocations in round brackets e.g. (3) at end of each sub-question
- Each question must have a realistic SA scenario/context
- Write ALL questions in full — do not truncate

After the full paper write:
===MEMORANDUM===
Full solutions with mark allocations per step. Tag each [L1] [L2] [L3] or [L4].

===COGNITIVE LEVEL TABLE===
Question | Subtopic | Marks | L1 | L2 | L3 | L4
(one row per sub-question, then TOTAL row, then % row)`;

  const context = extraContext ? `REFERENCE PAPER (use for format/style guidance only — do not copy):\n${extraContext.slice(0, 6000)}` : "";
  return callGemini(EXAMINER_SYSTEM, user, context);
}

// ─── FORMAL ASSESSMENT ──────────────────────────────────────────
export async function generateFormalAssessment({
  assessmentType, selectedTopics, teacher, totalMarks, duration, term, paper, questionBankText = "",
}) {
  const topicList = selectedTopics.map((t) => {
    const outcomes = (t.learningOutcomes || []).map((o, i) => `   ${i + 1}. ${o}`).join("\n");
    return `${t.topic}: ${t.subtopic}\n${outcomes}`;
  }).join("\n\n");

  const user = `Generate a COMPLETE formal ${assessmentType} for Grade 12 Mathematical Literacy.

SCHOOL: ${teacher.schoolName}${teacher.district ? ` | ${teacher.district}` : ""}${teacher.province ? ` | ${teacher.province}` : ""}
EXAMINER: ${teacher.name} ${teacher.surname}
YEAR: ${teacher.year}
TERM: ${term}${paper ? ` | PAPER: ${paper}` : ""}
TOTAL MARKS: ${totalMarks}
DURATION: ${duration}

TOPICS AND OUTCOMES TO ASSESS:
${topicList}

CAPS COGNITIVE LEVEL REQUIREMENTS:
L1 Knowledge: 30% = ${Math.round(totalMarks * 0.3)} marks
L2 Routine Procedures: 30% = ${Math.round(totalMarks * 0.3)} marks
L3 Complex Procedures: 20% = ${Math.round(totalMarks * 0.2)} marks
L4 Reasoning and Reflecting: 20% = ${Math.round(totalMarks * 0.2)} marks

PAPER STRUCTURE REQUIREMENTS:
- Start with INSTRUCTIONS AND INFORMATION section (9 standard NSC instructions)
- Minimum 2 questions, each with a detailed real-life SA scenario/context
- Sub-questions numbered 1.1, 1.2, 1.2.1, 1.2.2 etc
- Every sub-question fully written out with ALL necessary data/tables/values included in the question
- Mark allocation in brackets (3) at end of each sub-question
- Total marks shown at end of each question e.g. [25]
- Grand total shown at end of paper e.g. TOTAL: ${totalMarks}
- Write EVERY question completely — do not truncate or summarise

After completing the full paper:

===MEMORANDUM===
- Heading: MEMORANDUM - STRICTLY CONFIDENTIAL
- Full worked solution for every sub-question
- Mark per step shown as a tick or /1 /2 /3
- Acceptable alternatives in brackets
- Cognitive level tagged: [L1] [L2] [L3] [L4]
- Total per question shown

===COGNITIVE LEVEL TABLE===
Question | Sub-question | Topic | Total Marks | L1 | L2 | L3 | L4
(complete row for every sub-question, then TOTALS row, then PERCENTAGE row)`;

  const context = questionBankText ? `REFERENCE PAPER (style/difficulty guide only — do not copy questions):\n${questionBankText.slice(0, 6000)}` : "";
  return callGemini(EXAMINER_SYSTEM, user, context);
}

// ─── INVESTIGATION ──────────────────────────────────────────────
export async function generateInvestigation({ selectedTopics, teacher, term, questionBankText = "" }) {
  const topicList = selectedTopics.map((t) => {
    const outcomes = (t.learningOutcomes || []).map((o, i) => `   ${i + 1}. ${o}`).join("\n");
    return `${t.topic}: ${t.subtopic}\n${outcomes}`;
  }).join("\n\n");

  const user = `Design a COMPLETE Investigation/Assignment for Grade 12 Mathematical Literacy.

SCHOOL: ${teacher.schoolName}${teacher.district ? ` | ${teacher.district}` : ""}${teacher.province ? ` | ${teacher.province}` : ""}
EXAMINER: ${teacher.name} ${teacher.surname}
YEAR: ${teacher.year}
TERM: ${term}
TOTAL MARKS: 50
DURATION: 1-2 weeks (take-home)

TOPICS AND OUTCOMES:
${topicList}

REQUIREMENTS:
- Rich real-world SA context (spaza shop, municipal budget, taxi route, community event etc)
- One detailed scenario/stimulus at the start with tables, data, or documents
- 3 structured tasks (TASK 1, TASK 2, TASK 3)
- Sub-questions within each task: 1.1, 1.2 etc
- Every sub-question fully written with all needed data
- Mark allocations in brackets (3) after each sub-question
- Include cognitive levels L1 through L4
- Clear learner instructions at the top

After the full investigation:

===MEMORANDUM===
Full marking memorandum with marks per step and cognitive level tags.

===COGNITIVE LEVEL TABLE===
Question | Sub-question | Topic | Total Marks | L1 | L2 | L3 | L4
(complete row for every sub-question, then TOTALS row, then PERCENTAGE row)`;

  const context = questionBankText ? `REFERENCE PAPER (style guide only):\n${questionBankText.slice(0, 6000)}` : "";
  return callGemini(EXAMINER_SYSTEM, user, context);
}
