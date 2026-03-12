import React, { useEffect, useState, useCallback } from "react";
import "./scss/interview.scss";
import { useParams } from "react-router-dom";
import Navbar from "../../components/navbar/navbar";
import axiosInstance from "../../utils/axios/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
interface SkillGap {
  skill: string;
  severity: "high" | "medium" | "low";
  explanation: string;
  resources?: string[];
}

interface Question {
  question: string;
  difficulty: "easy" | "medium" | "hard";
  tags?: string[];
  expectedAnswer?: string;
}

interface BehavioralQuestion {
  question: string;
  difficulty: "easy" | "medium" | "hard";
}

interface DailyTask {
  _id: string;
  task: string;
  completed: boolean;
}

interface DayPlan {
  day: number;
  focus: string;
  tasks: DailyTask[];
  completedCount: number;
  totalCount: number;
  isCompleted: boolean;
  isUnlocked: boolean;
}

interface PreparationPlan {
  totalDays: number;
  plan: DayPlan[];
}

interface Report {
  _id: string;
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
  preparationPlan: PreparationPlan;
  jobDescription?: string;
  createdAt: string;
}

// ── Dummy fallback (remove once API is wired) ─────────────────────────────────
const DUMMY: Report = {
  _id: "dummy",
  overallScore: 80,
  sectionScores: { technical: 75, behavioral: 85, communication: 80 },
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
      explanation: "Limited knowledge of WCAG guidelines and best practices.",
    },
    {
      skill: "Testing",
      severity: "low",
      explanation: "Jest / RTL not mentioned anywhere in the resume.",
    },
    {
      skill: "System Design",
      severity: "high",
      explanation: "No evidence of large-scale architecture experience.",
    },
  ],
  technicalQuestions: [
    {
      question: "Explain React Virtual DOM and reconciliation.",
      difficulty: "medium",
      tags: ["React"],
    },
    {
      question: "What are React Hooks? List 5 with use cases.",
      difficulty: "easy",
      tags: ["React"],
    },
    {
      question: "How does useCallback differ from useMemo?",
      difficulty: "medium",
      tags: ["React", "Performance"],
    },
    {
      question: "Describe your approach to code-splitting.",
      difficulty: "hard",
      tags: ["Performance"],
    },
  ],
  behavioralQuestions: [
    {
      question: "Tell me about a time you navigated a difficult project.",
      difficulty: "medium",
    },
    { question: "How do you handle tight deadlines?", difficulty: "easy" },
    {
      question:
        "Describe a disagreement with a teammate and how you resolved it.",
      difficulty: "medium",
    },
  ],
  preparationPlan: {
    totalDays: 3,
    plan: [
      {
        day: 1,
        focus: "React Fundamentals",
        isUnlocked: true,
        isCompleted: false,
        completedCount: 0,
        totalCount: 2,
        tasks: [
          { _id: "t1", task: "Review hooks in-depth", completed: false },
          { _id: "t2", task: "Build a reusable component", completed: false },
        ],
      },
      {
        day: 2,
        focus: "Testing",
        isUnlocked: false,
        isCompleted: false,
        completedCount: 0,
        totalCount: 2,
        tasks: [
          { _id: "t3", task: "Learn Jest basics", completed: false },
          { _id: "t4", task: "Write sample unit tests", completed: false },
        ],
      },
      {
        day: 3,
        focus: "Accessibility",
        isUnlocked: false,
        isCompleted: false,
        completedCount: 0,
        totalCount: 2,
        tasks: [
          {
            _id: "t5",
            task: "Study ARIA roles and landmarks",
            completed: false,
          },
          {
            _id: "t6",
            task: "Audit a sample UI for a11y issues",
            completed: false,
          },
        ],
      },
    ],
  },
  jobDescription: "Senior Frontend Engineer",
  createdAt: new Date().toISOString(),
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const scoreColor = (score: number) =>
  score >= 80 ? "green" : score >= 60 ? "accent" : "red";

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

// ── Sub-components ─────────────────────────────────────────────────────────────

const ScoreRing: React.FC<{ score: number }> = ({ score }) => {
  const r = 65;
  const circ = 2 * Math.PI * r;
  const offset = circ - (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <div className="card score-ring-card">
      <div className="score-ring-card__wrap">
        <svg viewBox="0 0 160 160" className="score-ring-card__svg">
          <circle className="sr-track" cx="80" cy="80" r={r} />
          <circle
            className={`sr-fill sr-fill--${color}`}
            cx="80"
            cy="80"
            r={r}
            style={{ "--dash-offset": offset } as React.CSSProperties}
          />
        </svg>
        <div className="score-ring-card__center">
          <span className="score-ring-card__num">{score}</span>
          <span className="score-ring-card__denom">/100</span>
        </div>
      </div>
      <span className="score-ring-card__label">Overall Score</span>
    </div>
  );
};

const SectionBreakdown: React.FC<{ scores: Report["sectionScores"] }> = ({
  scores,
}) => {
  const entries = Object.entries(scores) as [string, number][];
  const colorMap: Record<string, string> = {
    technical: "blue",
    behavioral: "green",
    communication: "accent",
  };
  return (
    <div className="card section-breakdown">
      <p className="card-label">Section Breakdown</p>
      <div className="section-breakdown__list">
        {entries.map(([key, val]) => (
          <div className="sbar" key={key}>
            <div className="sbar__header">
              <span className="sbar__name">{key}</span>
              <span
                className={`sbar__val sbar__val--${colorMap[key] ?? "accent"}`}
              >
                {val}%
              </span>
            </div>
            <div className="sbar__track">
              <div
                className={`sbar__fill sbar__fill--${colorMap[key] ?? "accent"}`}
                style={{ "--bar-w": `${val}%` } as React.CSSProperties}
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
  <span className={`sev-badge sev-badge--${severity}`}>
    <span className="sev-dot" />
    {severity}
  </span>
);

const DiffBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => (
  <span className={`diff-badge diff-badge--${difficulty}`}>{difficulty}</span>
);

// ── Day Progress Ring (small) ─────────────────────────────────────────────────
const DayRing: React.FC<{ completed: number; total: number }> = ({
  completed,
  total,
}) => {
  const pct = total === 0 ? 0 : (completed / total) * 100;
  const r = 14;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <div className="day-ring">
      <svg width="36" height="36" viewBox="0 0 36 36">
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3"
          className="day-ring__track"
        />
        <circle
          cx="18"
          cy="18"
          r={r}
          fill="none"
          strokeWidth="3"
          className="day-ring__fill"
          strokeDasharray={`${circ - offset} ${offset}`}
          strokeLinecap="round"
          transform="rotate(-90 18 18)"
        />
      </svg>
      <span className="day-ring__pct">{Math.round(pct)}%</span>
    </div>
  );
};

// ── Main Page ─────────────────────────────────────────────────────────────────
const InterviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [report, setReport] = useState<Report>(DUMMY);
  const [loading, setLoading] = useState(false);
  const [toggling, setToggling] = useState<string | null>(null); // taskId being toggled
  const [activeDay, setActiveDay] = useState<number>(0);

  // ── Fetch report ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!id || id === "dummy") return;
    setLoading(true);
    axiosInstance
      .get(`/interview/${id}`)
      .then((res) => setReport(res.data.report))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  // ── Set active day to first unlocked + incomplete ───────────────────────────
  useEffect(() => {
    const plan = report.preparationPlan?.plan ?? [];
    const idx = plan.findIndex((d) => d.isUnlocked && !d.isCompleted);
    setActiveDay(idx >= 0 ? idx : 0);
  }, []);

  // ── Toggle task ─────────────────────────────────────────────────────────────
  const handleToggleTask = useCallback(
    async (dayIndex: number, taskId: string) => {
      const day = report.preparationPlan?.plan?.[dayIndex];
      if (!day?.isUnlocked) return;

      setToggling(taskId);

      // Optimistic update
      setReport((prev) => {
        const plan = prev.preparationPlan.plan.map((d, di) => {
          if (di !== dayIndex) return d;
          const tasks = d.tasks.map((t) =>
            t._id === taskId ? { ...t, completed: !t.completed } : t,
          );
          const completedCount = tasks.filter((t) => t.completed).length;
          const isCompleted = completedCount === tasks.length;
          return { ...d, tasks, completedCount, isCompleted };
        });

        // Unlock next day optimistically
        const updatedPlan = plan.map((d, di) => {
          if (di === dayIndex + 1 && plan[dayIndex].isCompleted) {
            return { ...d, isUnlocked: true };
          }
          return d;
        });

        return {
          ...prev,
          preparationPlan: { ...prev.preparationPlan, plan: updatedPlan },
        };
      });

      try {
        const res = await axiosInstance.patch(
          `/interview/${report._id}/tasks`,
          {
            dayIndex,
            taskId,
          },
        );
        // Sync with server response (source of truth)
        setReport((prev) => ({
          ...prev,
          preparationPlan: res.data.preparationPlan,
        }));
      } catch (err) {
        console.error(err);
        // Revert optimistic update on error
        if (id && id !== "dummy") {
          const res = await axiosInstance.get(`/interview/${id}`);
          setReport(res.data.report);
        }
      } finally {
        setToggling(null);
      }
    },
    [report, id],
  );

  if (loading) {
    return (
      <div className="interview-page">
        <Navbar context="interview" />
        <div className="ip-loading">
          <div className="ip-loading__spinner" />
          <p>Loading report...</p>
        </div>
      </div>
    );
  }

  const plan = report.preparationPlan?.plan ?? [];
  const totalTasks = plan.reduce((acc, d) => acc + d.totalCount, 0);
  const doneTasks = plan.reduce((acc, d) => acc + d.completedCount, 0);
  const planPct =
    totalTasks === 0 ? 0 : Math.round((doneTasks / totalTasks) * 100);

  const allTasksDone = plan.every((d) => d.isCompleted);

  return (
    <div className="interview-page">
      <Navbar context="interview" />

      <main className="ip-main">
        {/* ── Hero ── */}
        <header className="ip-hero">
          {/* background grid */}
          <div className="ip-hero__grid" />
          <div className="ip-hero__glow" />

          {/* top row — eyebrow + date */}
          <div className="ip-hero__topbar">
            <div className="ip-hero__eyebrow">
              <span className="eyebrow-dot" />
              Interview Prep Report
            </div>
            <span className="ip-hero__date">
              {report.jobDescription && <>{report.jobDescription} · </>}
              {formatDate(report.createdAt)}
            </span>
          </div>

          {/* center — big score + title */}
          <div className="ip-hero__center">
            <div className="ip-hero__score-wrap">
              <span className="ip-hero__score-num">{report.overallScore}</span>
              <span className="ip-hero__score-denom">/100</span>
            </div>
            <h1 className="ip-hero__title">
              You're{" "}
              <span className="ip-hero__title--accent">
                {report.overallScore >= 80
                  ? "well prepared"
                  : report.overallScore >= 60
                    ? "almost ready"
                    : "getting there"}
              </span>
              <br />
              for your next interview.
            </h1>
          </div>

          {/* bottom row — 3 stats */}
          <div className="ip-hero__stats">
            <div className="ip-hero__stat">
              <span className="ip-hero__stat-num">
                {report.skillGaps.length}
              </span>
              <span className="ip-hero__stat-lbl">Skill Gaps</span>
            </div>
            <div className="ip-hero__stat-divider" />
            <div className="ip-hero__stat">
              <span className="ip-hero__stat-num">{planPct}%</span>
              <span className="ip-hero__stat-lbl">Plan Done</span>
            </div>
            <div className="ip-hero__stat-divider" />
            <div className="ip-hero__stat">
              <span className="ip-hero__stat-num">
                {report.technicalQuestions.length +
                  report.behavioralQuestions.length}
              </span>
              <span className="ip-hero__stat-lbl">Questions</span>
            </div>
            <div className="ip-hero__stat-divider" />
            <div className="ip-hero__stat">
              <span className="ip-hero__stat-num">
                {report.strengths.length}
              </span>
              <span className="ip-hero__stat-lbl">Strengths</span>
            </div>
          </div>
        </header>
        {/* ── Overview ── */}
        <div className="ip-section-label">Overview</div>
        <div className="overview-grid">
          <ScoreRing score={report.overallScore} />
          <SectionBreakdown scores={report.sectionScores} />
        </div>

        {/* ── Insights ── */}
        <div className="ip-section-label">Insights</div>
        <div className="two-col">
          <div className="card">
            <p className="card-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              Strengths
            </p>
            <div className="insight-list">
              {report.strengths.map((s, i) => (
                <div className="insight-item insight-item--strength" key={i}>
                  <span className="insight-icon">✓</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <p className="card-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="19" x2="12" y2="5" />
                <polyline points="5 12 12 5 19 12" />
              </svg>
              To Improve
            </p>
            <div className="insight-list">
              {report.improvements.map((s, i) => (
                <div className="insight-item insight-item--improve" key={i}>
                  <span className="insight-icon">↑</span>
                  <span>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Skill Gaps ── */}
        <div className="ip-section-label">Skill Gaps</div>
        <div className="card full-row">
          <div className="skill-gaps">
            {report.skillGaps.map((gap, i) => (
              <div className="gap-item" key={i}>
                <div className="gap-item__top">
                  <span className="gap-item__skill">{gap.skill}</span>
                  <SeverityBadge severity={gap.severity} />
                </div>
                <p className="gap-item__desc">{gap.explanation}</p>
                {gap.resources && gap.resources.length > 0 && (
                  <div className="gap-item__resources">
                    {gap.resources.map((r, ri) => (
                      <a
                        key={ri}
                        href={r}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gap-resource"
                      >
                        {r}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Questions ── */}
        <div className="ip-section-label">Practice Questions</div>
        <div className="two-col">
          <div className="card">
            <p className="card-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <polyline points="16 18 22 12 16 6" />
                <polyline points="8 6 2 12 8 18" />
              </svg>
              Technical
            </p>
            <div className="q-list">
              {report.technicalQuestions.map((q, i) => (
                <div className="q-item" key={i}>
                  <p className="q-item__text">{q.question}</p>
                  <div className="q-item__meta">
                    <DiffBadge difficulty={q.difficulty} />
                    {q.tags?.map((tag) => (
                      <span className="tag-pill" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <p className="card-label">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                <circle cx="9" cy="7" r="4" />
              </svg>
              Behavioral
            </p>
            <div className="q-list">
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

        {/* ── Preparation Plan ── */}
        <div className="ip-section-label">Preparation Plan</div>
        <div className="card full-row prep-card">
          {/* Plan header */}
          <div className="prep-header">
            <div className="prep-header__left">
              <span className="prep-header__title">
                ◆ {report.preparationPlan?.totalDays}-Day Study Plan
              </span>
              <span className="prep-header__sub">
                {doneTasks} of {totalTasks} tasks completed
              </span>
            </div>
            <div className="prep-header__right">
              <div className="prep-overall-bar">
                <div className="prep-overall-bar__track">
                  <div
                    className="prep-overall-bar__fill"
                    style={{ width: `${planPct}%` }}
                  />
                </div>
                <span className="prep-overall-bar__pct">{planPct}%</span>
              </div>
            </div>
          </div>

          {/* Day tabs */}
          <div className="day-tabs">
            {plan.map((day, di) => (
              <button
                key={day.day}
                className={[
                  "day-tab",
                  di === activeDay ? "day-tab--active" : "",
                  day.isCompleted ? "day-tab--done" : "",
                  !day.isUnlocked ? "day-tab--locked" : "",
                ].join(" ")}
                onClick={() => day.isUnlocked && setActiveDay(di)}
                disabled={!day.isUnlocked}
              >
                {day.isCompleted ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : !day.isUnlocked ? (
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <rect x="3" y="11" width="18" height="11" rx="2" />
                    <path d="M7 11V7a5 5 0 0110 0v4" />
                  </svg>
                ) : (
                  <span className="day-tab__num">{day.day}</span>
                )}
                <span className="day-tab__label">Day {day.day}</span>
              </button>
            ))}
          </div>

          {/* Active day panel */}
          {plan[activeDay] &&
            (() => {
              const day = plan[activeDay];
              return (
                <div
                  className={`day-panel ${!day.isUnlocked ? "day-panel--locked" : ""}`}
                >
                  <div className="day-panel__header">
                    <div className="day-panel__info">
                      <span className="day-panel__num">Day {day.day}</span>
                      <h3 className="day-panel__focus">{day.focus}</h3>
                    </div>
                    <DayRing
                      completed={day.completedCount}
                      total={day.totalCount}
                    />
                  </div>

                  {!day.isUnlocked ? (
                    <div className="day-panel__locked">
                      <svg
                        width="28"
                        height="28"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                      >
                        <rect x="3" y="11" width="18" height="11" rx="2" />
                        <path d="M7 11V7a5 5 0 0110 0v4" />
                      </svg>
                      <p>Complete Day {day.day - 1} to unlock this day.</p>
                    </div>
                  ) : (
                    <div className="day-panel__tasks">
                      {day.tasks.map((task) => (
                        <button
                          key={task._id}
                          className={`task-row ${task.completed ? "task-row--done" : ""} ${toggling === task._id ? "task-row--loading" : ""}`}
                          onClick={() => handleToggleTask(activeDay, task._id)}
                          disabled={toggling === task._id}
                        >
                          <span
                            className={`task-checkbox ${task.completed ? "task-checkbox--checked" : ""}`}
                          >
                            {task.completed && (
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3.5"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </span>
                          <span className="task-text">{task.task}</span>
                          {toggling === task._id && (
                            <span className="task-spinner" />
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {day.isCompleted && (
                    <div className="day-panel__complete-banner">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Day {day.day} complete!
                      {plan[activeDay + 1] &&
                        !plan[activeDay + 1].isCompleted && (
                          <button
                            className="day-next-btn"
                            onClick={() => setActiveDay(activeDay + 1)}
                          >
                            Go to Day {day.day + 1} →
                          </button>
                        )}
                    </div>
                  )}
                </div>
              );
            })()}

          <div className="export-btn-container">
            <button
              className={`export-btn ${!allTasksDone ? "export-btn--locked" : ""}`}
              onClick={() => {}}
              disabled={!allTasksDone}
              title={
                !allTasksDone
                  ? "Complete all preparation tasks to unlock PDF export"
                  : "Export PDF"
              }
            >
              {!allTasksDone ? (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <rect x="3" y="11" width="18" height="11" rx="2" />
                  <path d="M7 11V7a5 5 0 0110 0v4" />
                </svg>
              ) : (
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
              )}
              Export PDF
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewPage;
