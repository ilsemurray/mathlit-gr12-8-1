/**
 * claude.js — Service for all Anthropic API calls
 * All AI-powered features route through this file.
 * This keeps API logic in one place and makes it easy to update prompts.
 */

const CLAUDE_API_URL = "https://api.anthropic.com/v1/messages";
const MODEL = "claude-sonnet-4-20250514";
const MAX_TOKENS = 4000;

async function callClaude(systemPrompt, userPrompt) {
  const response = await fetch(CLAUDE_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: MAX_TOKENS,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || "Claude API error");
  }

  const data = await response.json();
  return data.content.map((b) => b.text || "").join("\n");
}

// ─────────────────────────────────────────────────────────────────
// LESSON GENERATION
// ─────────────────────────────────────────────────────────────────
export async function generateLesson(topic) {
  const system = `You are an expert South African Mathematical Literacy teacher and curriculum specialist with deep knowledge of the CAPS (Curriculum and Assessment Policy Statement) for Grade 12 Mathematical Literacy. You generate detailed, practical lesson plans aligned to the CAPS document. Always respond in clear, professional English suitable for a South African teacher.`;

  const user = `Generate a detailed lesson plan for the following Grade 12 Mathematical Literacy topic:

Topic: ${topic.topic}
Subtopic: ${topic.subtopic}
CAPS Reference: ${topic.capsRef}
Duration: ${topic.duration}
Cognitive Levels: ${topic.cognitiveLevel.join(", ")}

Learning Outcomes:
${topic.learningOutcomes.map((o, i) => `${i + 1}. ${o}`).join("\n")}

The lesson plan must include:
1. LESSON INTRODUCTION (how to hook learners, link to prior knowledge)
2. MAIN CONTENT (step-by-step explanation of key concepts with examples using South African contexts — use Rands, South African places, relatable scenarios)
3. WORKED EXAMPLES (at least 3 fully worked examples at different cognitive levels)
4. CLASSWORK ACTIVITY (5-8 questions for learners to attempt in class)
5. HOMEWORK (3-5 consolidation questions)
6. LESSON CLOSURE (summary and key takeaways)

Format the response clearly with headings. Use realistic South African examples and contexts throughout.`;

  return callClaude(system, user);
}

// ─────────────────────────────────────────────────────────────────
// TOPIC ASSESSMENT GENERATION
// ─────────────────────────────────────────────────────────────────
export async function generateTopicAssessment(topic, teacher) {
  const system = `You are an expert South African Mathematical Literacy examiner who writes assessments strictly aligned to the CAPS document and NSC examination standards. You produce high-quality, contextual questions. Always use South African contexts (Rands, South African cities, local scenarios).`;

  const user = `Generate a topic assessment (test/quiz) for Grade 12 Mathematical Literacy.

Topic: ${topic.topic}
Subtopic: ${topic.subtopic}
CAPS Reference: ${topic.capsRef}
Cognitive Levels to include: ${topic.cognitiveLevel.join(", ")} (align marks approximately: L1=30%, L2=30%, L3=20%, L4=20%)

Teacher: ${teacher.name} ${teacher.surname}
School: ${teacher.schoolName}

Generate a formal assessment with:
- Total marks: 50
- Questions spread across all required cognitive levels
- Real-world South African contexts
- Clear mark allocations per question/sub-question
- Questions numbered in NSC style (e.g. QUESTION 1, 1.1, 1.1.1)
- A cover page with school name, subject, grade, date, and time allocation
- Instructions to learners

After the assessment, generate a complete MEMORANDUM with:
- Full solutions and working shown
- Marks clearly allocated
- Acceptable alternative answers where applicable
- Cognitive level tagged per question (L1/L2/L3/L4)

Separate the assessment and memorandum clearly with "--- MEMORANDUM ---"`;

  return callClaude(system, user);
}

// ─────────────────────────────────────────────────────────────────
// FORMAL ASSESSMENT GENERATION (Control Test / Exam / Investigation)
// ─────────────────────────────────────────────────────────────────
export async function generateFormalAssessment({
  assessmentType,
  taughtTopics,
  teacher,
  totalMarks,
  duration,
  term,
  paper,
}) {
  const system = `You are a senior South African Mathematical Literacy examiner with extensive experience writing NSC-style papers. You write formal assessments that are fully CAPS-aligned, contextual, and adhere to the NSC examination format and cognitive level requirements. Use realistic South African contexts throughout.`;

  const topicList = taughtTopics.map((t) => `- ${t.topic}: ${t.subtopic}`).join("\n");

  const user = `Generate a formal ${assessmentType} for Grade 12 Mathematical Literacy.

TEACHER DETAILS:
Name: ${teacher.name} ${teacher.surname}
School: ${teacher.schoolName}
${teacher.district ? `District: ${teacher.district}` : ""}
${teacher.province ? `Province: ${teacher.province}` : ""}
Year: ${teacher.year}

ASSESSMENT DETAILS:
Type: ${assessmentType}
Term: ${term}
${paper ? `Paper: ${paper}` : ""}
Total Marks: ${totalMarks}
Duration: ${duration}

TOPICS COVERED (only set questions on these topics):
${topicList}

COGNITIVE LEVEL REQUIREMENTS (CAPS):
- L1 Knowledge: approximately 30% of marks (${Math.round(totalMarks * 0.3)} marks)
- L2 Routine Procedures: approximately 30% of marks (${Math.round(totalMarks * 0.3)} marks)  
- L3 Complex Procedures: approximately 20% of marks (${Math.round(totalMarks * 0.2)} marks)
- L4 Reasoning & Reflecting: approximately 20% of marks (${Math.round(totalMarks * 0.2)} marks)

FORMAT REQUIREMENTS:
- NSC-style layout with formal cover page
- Instructions to learners (answer all questions, show all working, etc.)
- Questions numbered QUESTION 1, QUESTION 2, etc. with sub-questions 1.1, 1.1.1, etc.
- Mark allocations shown in brackets e.g. (3)
- Running total or marks per question shown
- Real South African contexts with Rands and local scenarios
- Each question based on a realistic scenario/context

After the full assessment paper, provide:

--- MEMORANDUM ---
Full memorandum with:
- Complete worked solutions
- Mark allocation per step
- Acceptable alternatives noted
- Cognitive level per question tagged [L1], [L2], [L3], [L4]

--- COGNITIVE LEVEL SUMMARY TABLE ---
A table showing:
| Question | Topic | Marks | L1 | L2 | L3 | L4 |
For every question and sub-question, then a totals row and percentage row.`;

  return callClaude(system, user);
}

// ─────────────────────────────────────────────────────────────────
// INVESTIGATION GENERATION
// ─────────────────────────────────────────────────────────────────
export async function generateInvestigation({ taughtTopics, teacher, term }) {
  const system = `You are an expert South African Mathematical Literacy educator who designs rich, contextual investigations aligned to the CAPS document. Investigations must be engaging, real-world, and allow learners to demonstrate mathematical reasoning.`;

  const topicList = taughtTopics.map((t) => `- ${t.topic}: ${t.subtopic}`).join("\n");

  const user = `Design a formal Investigation for Grade 12 Mathematical Literacy.

Teacher: ${teacher.name} ${teacher.surname}
School: ${teacher.schoolName}
Term: ${term}
Year: ${teacher.year}

Topics covered so far:
${topicList}

The investigation must:
- Be based on a rich, real-world South African context (e.g. running a spaza shop, planning a community event, analysing municipal data, planning a road trip)
- Integrate at least 2-3 topics from the list above
- Include a scenario/stimulus (could reference a table, graph, or document)
- Have structured tasks (Task 1, Task 2, Task 3) with sub-questions
- Total 50 marks
- Include cognitive levels L1 through L4
- Be completable over 1-2 weeks as a take-home investigation
- Include clear instructions and assessment criteria

After the investigation, provide:
--- MEMORANDUM ---
Full marking memorandum with marks per step and cognitive level tags.

--- COGNITIVE LEVEL SUMMARY TABLE ---
Table showing marks per cognitive level per question.`;

  return callClaude(system, user);
}
