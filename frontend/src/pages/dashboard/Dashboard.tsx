import { Navigate, useNavigate } from "react-router-dom";
import "./scss/dashboard.scss";
import { useEffect, useState } from "react";
import { useUser } from "../../context/user/user.context";
import axiosInstance from "../../utils/axios/axios";
import type { Analysis, InterviewReportResponse } from "./types";
import Navbar from "../../components/navbar/navbar";

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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const { user, setUser } = useUser();

  // if (user == null) {
  //   return <Navigate to="/login" />;
  // }

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get<InterviewReportResponse>(
          "/data/dashboard",
          {
            withCredentials: true,
          },
        );
        setDashboardData(res.data.report);
      } catch (err) {
        console.error("Dashboard fetch failed", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = dashboardData
    ? [
        {
          label: "Analyses Run",
          value: dashboardData.totalAnalysis,
          delta: `${dashboardData.analysisThisWeek} this week`,
        },
        {
          label: "Avg. Score",
          value: dashboardData.averageScore,
          delta: "Across all analyses",
          unit: "%",
        },
        {
          label: "Top Match",
          value: dashboardData.topMatch?.overallScore || 0,
          delta: "Best performing analysis",
          unit: "%",
        },
        {
          label: "Analyses Left",
          value: "8",
          delta: "Free plan · 20/mo",
        },
      ]
    : [];

  const analyses: Analysis[] =
    dashboardData?.recentAnalysis?.map((item: any) => ({
      id: item._id,
      role: "Frontend Engineer", // you can parse this later
      company: "Company", // optional improvement later
      score: item.overallScore,
      date: new Date(item.createdAt).toLocaleDateString(),
      tags: item.technicalQuestions?.[0]?.tags || [],
      status: scoreColor(item.overallScore),
    })) || [];

  if (loading) {
    return (
      <div className="dash-root">
        <Navbar
          userName={user?.name}
          userInitials={user?.name
            .replaceAll(" ", "")
            .split("")[0]
            .toUpperCase()}
        />
        <main className="dash-main">
          <div className="dash-container">
            <p>Loading dashboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="dash-root">
      <Navbar
        userName={user?.name}
        userInitials={user?.name.replaceAll(" ", "").split("")[0].toUpperCase()}
      />

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
            {stats.map((stat, i) => (
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

            {analyses.length === 0 ? (
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
                {analyses.map((item, i) => (
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
                        {item.status === "high"
                          ? "High"
                          : item.status === "medium"
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
          {/* <section className="dash-usage">
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
          </section> */}
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
