import React from "react";
import "./interview.scss";
import { Link } from "react-router-dom";

// ── Types ────────────────────────────────────────────────────────────────────
interface SkillGap {
  skill: string;
  severity: "high" | "medium" | "low";
  explanation: string;
}

interface Question {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
}

interface BehavioralQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

interface Task {
  task: string;
}

interface DayPlan {
  day: number;
  focus: string;
  tasks: Task[];
}

interface Report {
  overallScore: number;
  sectionScores: {
    technical: number;
    behavioral: number;
    communication: number;
  };
  strengths: string[];
  improvements: string[];
  skillGaps: SkillGap[];
  technicalQuestions: Question[];
  behavioralQuestions: BehavioralQuestion[];
  preparationPlan: {
    totalDays: number;
    plan: DayPlan[];
  };
}

// ── Dummy Data ────────────────────────────────────────────────────────────────
const dummyReport: Report = {
  overallScore: 80,
  sectionScores: {
    technical: 75,
    behavioral: 85,
    communication: 80,
  },
  strengths: [
    "Strong React fundamentals",
    "Clean component architecture",
    "Good responsive UI design",
  ],
  improvements: [
    "Learn testing frameworks",
    "Improve accessibility knowledge",
    "Practice system design",
  ],
  skillGaps: [
    {
      skill: "Accessibility",
      severity: "medium",
      explanation: "Limited knowledge of WCAG.",
    },
    {
      skill: "Testing",
      severity: "low",
      explanation: "Jest / RTL not mentioned.",
    },
  ],
  technicalQuestions: [
    {
      question: "Explain React Virtual DOM.",
      difficulty: "medium",
      tags: ["React"],
    },
    {
      question: "What are React Hooks?",
      difficulty: "easy",
      tags: ["React"],
    },
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a difficult project.",
      difficulty: "medium",
    },
    {
      question: "How do you handle tight deadlines?",
      difficulty: "easy",
    },
  ],
  preparationPlan: {
    totalDays: 3,
    plan: [
      {
        day: 1,
        focus: "React Fundamentals",
        tasks: [{ task: "Review hooks" }, { task: "Build reusable component" }],
      },
      {
        day: 2,
        focus: "Testing",
        tasks: [{ task: "Learn Jest basics" }, { task: "Write sample tests" }],
      },
      {
        day: 3,
        focus: "Accessibility",
        tasks: [{ task: "Study ARIA roles" }, { task: "Audit sample UI" }],
      },
    ],
  },
};

// ── Sub-components ────────────────────────────────────────────────────────────

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
  const radius = 65;
  const circumference = 2 * Math.PI * radius; // ≈ 408.4
  const dashOffset = circumference - (score / 100) * circumference;

  return (
    <div className="card score-circle-card">
      <div className="arc-wrap">
        <svg viewBox="0 0 160 160">
          <circle className="track" cx="80" cy="80" r={radius} />
          <circle
            className="progress"
            cx="80"
            cy="80"
            r={radius}
            style={{ "--dash-offset": dashOffset } as React.CSSProperties}
          />
        </svg>
        <div className="score-circle-card__inner">
          <span className="score-circle-card__number">{score}</span>
          <span className="score-circle-card__denom">/100</span>
        </div>
      </div>
      <span className="score-circle-card__label">Overall Score</span>
    </div>
  );
};

const SectionScores: React.FC<{ scores: Report["sectionScores"] }> = ({
  scores,
}) => {
  const entries = Object.entries(scores) as [keyof typeof scores, number][];
  return (
    <div className="card section-scores">
      <p className="card-header">Section Breakdown</p>
      <div className="scores-inner">
        {entries.map(([key, value]) => (
          <div className="score-row" key={key}>
            <div className="score-row__header">
              <span className="score-row__name">{key}</span>
              <span className="score-row__value">{value}%</span>
            </div>
            <div className="score-row__track">
              <div
                className={`score-row__fill score-row__fill--${key}`}
                style={{ "--bar-width": `${value}%` } as React.CSSProperties}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SeverityBadge: React.FC<{ severity: SkillGap["severity"] }> = ({
  severity,
}) => (
  <span className={`severity-badge severity-badge--${severity}`}>
    <span className="dot" />
    {severity}
  </span>
);

const DiffBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => (
  <span className={`diff-badge diff-badge--${difficulty}`}>{difficulty}</span>
);

// ── Main Page ─────────────────────────────────────────────────────────────────
const InterviewPage: React.FC = () => {
  const report = dummyReport; // replace with API data later

  return (
    <div className="interview-page">
      {/* ── Navbar ── */}
      <nav className="nav">
        <Link to="/dashboard">
          <div className="nav__logo">
            <img src="/images/logo.png" alt="JobSync" />
            <span>JobSync</span>
          </div>
        </Link>

        <div className="nav__badge">
          <span className="dot" />
          Analysis Ready
        </div>

        <div className="nav__actions">
          <button className="btn btn--ghost btn--back">← Back</button>
          <button className="btn btn--accent">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export PDF
          </button>
        </div>
      </nav>

      {/* ── Body ── */}
      <main className="page-content">
        {/* Hero */}
        <header className="hero-header">
          <p className="hero-header__eyebrow">Interview Prep Report</p>
          <h1 className="hero-header__title">
            You're <strong>{report.overallScore}% ready</strong>
            <br />
            for your next interview.
          </h1>
          <p className="hero-header__meta">
            Generated just now · Frontend Engineer Role
          </p>
        </header>

        {/* Overview: Score Circle + Section Scores */}
        <p className="section-title">Overview</p>
        <div className="overview-grid">
          <ScoreCircle score={report.overallScore} />
          <SectionScores scores={report.sectionScores} />
        </div>

        {/* Strengths + Improvements */}
        <p className="section-title">Insights</p>
        <div className="two-col">
          <div className="card">
            <p className="section-title">Strengths</p>
            <div className="list-items">
              {report.strengths.map((s, i) => (
                <div className="list-item list-item--strength" key={i}>
                  <span className="list-item__icon">✓</span>
                  {s}
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="section-title">To Improve</p>
            <div className="list-items">
              {report.improvements.map((s, i) => (
                <div className="list-item list-item--improve" key={i}>
                  <span className="list-item__icon">↑</span>
                  {s}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Skill Gaps */}
        <p className="section-title">Skill Gaps</p>
        <div className="card full-row">
          <div className="skill-gaps-list">
            {report.skillGaps.map((gap, i) => (
              <div className="skill-gap-item" key={i}>
                <div className="skill-gap-item__top">
                  <span className="skill-gap-item__name">{gap.skill}</span>
                  <SeverityBadge severity={gap.severity} />
                </div>
                <p className="skill-gap-item__explanation">{gap.explanation}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Questions */}
        <p className="section-title">Practice Questions</p>
        <div className="two-col">
          <div className="card">
            <p className="section-title">Technical</p>
            <div className="questions-list">
              {report.technicalQuestions.map((q, i) => (
                <div className="q-item" key={i}>
                  <p className="q-item__text">{q.question}</p>
                  <div className="q-item__meta">
                    <DiffBadge difficulty={q.difficulty} />
                    {q.tags?.map((tag) => (
                      <span className="tag-badge" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card">
            <p className="section-title">Behavioral</p>
            <div className="questions-list">
              {report.behavioralQuestions.map((q, i) => (
                <div className="q-item" key={i}>
                  <p className="q-item__text">{q.question}</p>
                  <div className="q-item__meta">
                    <DiffBadge difficulty={q.difficulty} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Prep Plan */}
        <p className="section-title">Preparation Plan</p>
        <div className="card full-row">
          <div className="prep-plan">
            <div className="prep-plan__summary">
              ◆ {report.preparationPlan.totalDays}-Day Study Plan
            </div>
            <div className="prep-plan__days">
              {report.preparationPlan.plan.map((d) => (
                <div className="day-card" key={d.day}>
                  <p className="day-card__num">Day {d.day}</p>
                  <p className="day-card__focus">{d.focus}</p>
                  <div className="day-card__tasks">
                    {d.tasks.map((t, i) => (
                      <div className="day-card__task" key={i}>
                        <span className="checkbox" />
                        {t.task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewPage;
