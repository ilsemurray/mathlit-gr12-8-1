# Mathematical Literacy Grade 12 – CAPS Teacher Assistant

A web application for South African Grade 12 Mathematical Literacy teachers, built with React + Vite + Tailwind CSS, powered by the Anthropic Claude API.

---

## Features

- **ATP Tracker** — Mark topics as taught across all 4 terms. Visual progress bars per term.
- **Lesson Generator** — Generate detailed CAPS-aligned lesson plans with worked examples and SA contexts.
- **Misconception Viewer** — View common learner misconceptions and teaching strategies per topic.
- **Assessment Generator** — Generate control tests, mid-year exams, trial exams, investigations, and assignments.
- **Memorandum Generator** — Memorandums are auto-generated with every assessment.
- **Cognitive Level Summary** — Every formal assessment includes a CAPS-aligned cognitive level table (L1–L4).
- **NSC-Style Layout** — Assessments use your school name, teacher name, district, and province.
- **Teacher Settings** — Save your credentials once; they appear on every generated document.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| Routing | React Router v6 |
| State | React Context + localStorage |
| AI | Anthropic Claude API (claude-sonnet-4) |
| PDF (future) | WeasyPrint / Puppeteer |

---

## Getting Started

### 1. Install dependencies
```bash
npm install
```

### 2. Set up your API key
The Claude API key must be available. In production, route API calls through a backend to protect your key.
For local development, you can set up a simple Express proxy or use a Vite env variable.

Create a `.env` file:
```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Then update `src/services/claude.js` to use:
```js
headers: {
  "x-api-key": import.meta.env.VITE_ANTHROPIC_API_KEY,
  ...
}
```

> ⚠️ **Important**: Never expose your API key in a deployed frontend. Use a backend proxy (Node.js/FastAPI) in production.

### 3. Run the app
```bash
npm run dev
```

---

## Project Structure

```
src/
├── data/
│   └── capsTopics.js         ← Full CAPS ATP data (topics, misconceptions, outcomes)
├── context/
│   ├── TeacherContext.jsx    ← Teacher credentials, global state
│   └── TrackerContext.jsx    ← ATP progress tracking, localStorage
├── services/
│   └── claude.js             ← All Claude API calls (lessons, assessments, memos)
├── pages/
│   ├── Dashboard.jsx         ← Overview + progress stats
│   ├── Tracker.jsx           ← ATP topic tracker
│   ├── Lessons.jsx           ← Lesson generator
│   ├── Assessments.jsx       ← Assessment + memo generator
│   └── Settings.jsx          ← Teacher profile
├── components/
│   ├── layout/               ← Sidebar, PageWrapper
│   ├── shared/               ← Button, Modal, LoadingSpinner, Badge
│   ├── lessons/              ← LessonCard, MisconceptionPanel
│   ├── assessments/          ← AssessmentBuilder, CognitiveLevelTable
│   └── tracker/              ← ProgressTracker, TopicCheckbox
├── utils/
│   ├── constants.js          ← SA provinces, assessment types, color maps
│   ├── cognitiveUtils.js     ← Cognitive level validation + formatting
│   └── formatters.js         ← Date, text, download utilities
└── App.jsx                   ← Root with routing
```

---

## CAPS Data

The `capsTopics.js` file is the single source of truth for all curriculum data. It contains:
- All topics across Terms 1–4
- Learning outcomes per topic
- Common misconceptions + teaching strategies
- Teaching methods and resources
- Cognitive level tags (L1–L4)
- CAPS document references

**Do not hardcode topic names anywhere else in the app.** Always import from `capsTopics.js`.

---

## Roadmap

- [ ] PDF export with proper NSC paper formatting
- [ ] Supabase integration for cloud sync across devices
- [ ] Teacher login and multi-class support
- [ ] Lesson plan history and saved assessments
- [ ] Print-ready exam paper CSS
- [ ] Offline support (PWA)

---

## Curriculum Alignment

This app is designed for use with the:
> **Curriculum and Assessment Policy Statement (CAPS)**
> Mathematical Literacy, Further Education and Training Phase
> Grade 10–12
> Department of Basic Education, Republic of South Africa
