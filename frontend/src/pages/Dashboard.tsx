import { Navigate, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar/navbar.tsx";
import "./scss/dashboard.scss";
import { useUser } from "../context/user/user.context.tsx";

const MOCK_ANALYSES = [
  {
    id: "1",
    role: "Senior Frontend Engineer",
    company: "Stripe",
    score: 87,
    date: "2 hours ago",
    tags: ["React", "TypeScript", "Design Systems"],
    status: "strong",
  },
  {
    id: "2",
    role: "Product Designer",
    company: "Linear",
    score: 74,
    date: "Yesterday",
    tags: ["Figma", "UX Research", "Prototyping"],
    status: "good",
  },
  {
    id: "3",
    role: "Full Stack Developer",
    company: "Vercel",
    score: 61,
    date: "3 days ago",
    tags: ["Next.js", "Node.js", "PostgreSQL"],
    status: "fair",
  },
  {
    id: "4",
    role: "Staff Engineer",
    company: "Figma",
    score: 92,
    date: "1 week ago",
    tags: ["System Design", "Leadership", "Rust"],
    status: "strong",
  },
];

const MOCK_STATS = [
  { label: "Analyses Run", value: "12", delta: "+3 this week" },
  { label: "Avg. Score", value: "78", delta: "+4 vs last week", unit: "%" },
  { label: "Top Match", value: "92", delta: "Staff Eng @ Figma", unit: "%" },
  { label: "Analyses Left", value: "8", delta: "Free plan · 20/mo" },
];

// ── Helpers ───────────────────────────────────────────────────────────────────
const scoreColor = (score: number) => {
  if (score >= 85) return "strong";
  if (score >= 70) return "good";
  return "fair";
};

const ScoreRing = ({ score }: { score: number }) => {
  const r = 20;
  const circ = 2 * Math.PI * r;
  const fill = (score / 100) * circ;
  const status = scoreColor(score);

  return (
    <div className={`score-ring score-ring--${status}`}>
      <svg width="54" height="54" viewBox="0 0 54 54">
        <circle cx="27" cy="27" r={r} className="score-ring__track" />
        <circle
          cx="27"
          cy="27"
          r={r}
          className="score-ring__fill"
          strokeDasharray={`${fill} ${circ}`}
          strokeLinecap="round"
          transform="rotate(-90 27 27)"
        />
      </svg>
      <span className="score-ring__value">{score}</span>
    </div>
  );
};

// ── Component ─────────────────────────────────────────────────────────────────
function Dashboard() {
  const navigate = useNavigate();

  const { user, setUser } = useUser();

  // if (user == null) {
  //   return <Navigate to="/login" />;
  // }

  return (
    <div className="dash-root">
      <Navbar userName={user?.name} userInitials={user?.name.replaceAll(' ','').split('')[0].toUpperCase()} />

      <main className="dash-main">
        {/* Background glows */}
        <div className="dash-glow dash-glow--top" />
        <div className="dash-glow dash-glow--right" />

        <div className="dash-container">
          {/* ── Hero greeting + CTA ── */}
          <section className="dash-hero">
            <div className="dash-hero__text">
              <p className="dash-hero__eyebrow">
                <span className="eyebrow-dot" />
                Dashboard
              </p>
              <h1 className="dash-hero__title">
                Hey, {user?.name?.split(" ")[0]} 👋
              </h1>
              <p className="dash-hero__sub">
                Ready to land your next role? Analyze your resume against any
                job posting and get an instant AI-powered report.
              </p>
            </div>
            <button
              className="dash-hero__cta"
              onClick={() => navigate("/interview/new")}
            >
              <span className="cta-icon">
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </span>
              <span>New Analysis</span>
            </button>
          </section>

          {/* ── Stats row ── */}
          <section className="dash-stats">
            {MOCK_STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="dash-stat"
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                <p className="dash-stat__label">{stat.label}</p>
                <p className="dash-stat__value">
                  {stat.value}
                  {stat.unit && (
                    <span className="dash-stat__unit">{stat.unit}</span>
                  )}
                </p>
                <p className="dash-stat__delta">{stat.delta}</p>
              </div>
            ))}
          </section>

          {/* ── Recent analyses ── */}
          <section className="dash-recent">
            <div className="dash-recent__header">
              <h2 className="dash-recent__title">Recent Analyses</h2>
              <button
                className="dash-recent__see-all"
                onClick={() => navigate("/interviews")}
              >
                See all
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </div>

            {MOCK_ANALYSES.length === 0 ? (
              <div className="dash-empty">
                <div className="dash-empty__icon">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                </div>
                <p className="dash-empty__text">No analyses yet</p>
                <p className="dash-empty__sub">
                  Run your first resume analysis to get started
                </p>
                <button
                  className="dash-empty__btn"
                  onClick={() => navigate("/interview/new")}
                >
                  Start Now
                </button>
              </div>
            ) : (
              <div className="dash-analyses">
                {MOCK_ANALYSES.map((item, i) => (
                  <div
                    key={item.id}
                    className="dash-analysis-card"
                    style={{ animationDelay: `${0.1 + i * 0.07}s` }}
                    onClick={() => navigate(`/interview/${item.id}`)}
                  >
                    {/* Score ring */}
                    <ScoreRing score={item.score} />

                    {/* Info */}
                    <div className="dash-analysis-card__info">
                      <p className="dash-analysis-card__role">{item.role}</p>
                      <p className="dash-analysis-card__company">
                        {item.company}
                      </p>
                      <div className="dash-analysis-card__tags">
                        {item.tags.map((tag) => (
                          <span key={tag} className="dash-tag">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Meta + arrow */}
                    <div className="dash-analysis-card__meta">
                      <p className="dash-analysis-card__date">{item.date}</p>
                      <span className={`dash-badge dash-badge--${item.status}`}>
                        {item.status === "strong"
                          ? "Strong"
                          : item.status === "good"
                            ? "Good"
                            : "Fair"}
                      </span>
                    </div>

                    <div className="dash-analysis-card__arrow">
                      <svg
                        width="15"
                        height="15"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* ── Usage bar ── */}
          <section className="dash-usage">
            <div className="dash-usage__header">
              <span className="dash-usage__label">Monthly Usage</span>
              <span className="dash-usage__count">
                12 <span className="dash-usage__total">/ 20 analyses</span>
              </span>
            </div>
            <div className="dash-usage__track">
              <div className="dash-usage__fill" style={{ width: "60%" }} />
            </div>
            <p className="dash-usage__note">
              8 analyses remaining ·{" "}
              <button className="dash-usage__upgrade">Upgrade to Pro</button>
            </p>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
