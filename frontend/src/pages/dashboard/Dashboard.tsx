import { useNavigate } from "react-router-dom";
import "./scss/dashboard.scss";
import { useEffect, useState } from "react";
import { useUser } from "../../context/user/user.context";
import axiosInstance from "../../utils/axios/axios";
import type { Analysis, InterviewReportResponse } from "./types";
import Navbar from "../../components/navbar/navbar";
import Loader from "../../components/loader/loader";

// ── Types ─────────────────────────────────────────────────────────────────────
interface Pagination {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  perPage: number;
}

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

  // ── Paginated analyses state ───────────────────────────────────────────────
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [analysesLoading, setAnalysesLoading] = useState(false);

  const navigate = useNavigate();
  const { user } = useUser();

  // ── Fetch dashboard stats ──────────────────────────────────────────────────
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await axiosInstance.get<InterviewReportResponse>(
          "/data/dashboard",
          { withCredentials: true }
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

  // ── Fetch paginated analyses ───────────────────────────────────────────────
  useEffect(() => {
    const fetchAnalyses = async () => {
      setAnalysesLoading(true);
      try {
        const res = await axiosInstance.get(
          `/data/analyses?page=${currentPage}`,
          { withCredentials: true }
        );
        const mapped: Analysis[] = res.data.analyses.map((item: any) => ({
          id: item._id,
          role: item.jobDescription?.slice(0, 40) || "Interview Analysis",
          company: "—",
          score: item.overallScore,
          date: new Date(item.createdAt).toLocaleDateString(),
          tags: item.skillGaps?.slice(0, 3).map((g: any) => g.skill) || [],
          status: scoreColor(item.overallScore),
        }));
        setAnalyses(mapped);
        setPagination(res.data.pagination);
      } catch (err) {
        console.error("Analyses fetch failed", err);
      } finally {
        setAnalysesLoading(false);
      }
    };

    fetchAnalyses();
  }, [currentPage]);

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

  if (loading) {
    return <Loader variant="dashboard" />;
  }

  return (
    <div className="dash-root">
      <Navbar
        userName={user?.name}
        userInitials={user?.name.replaceAll(" ", "").split("")[0].toUpperCase()}
      />

      <main className="dash-main">
        <div className="dash-glow dash-glow--top" />
        <div className="dash-glow dash-glow--right" />

        <div className="dash-container">
          {/* ── Hero ── */}
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

          {/* ── Stats ── */}
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

          {/* ── Analyses ── */}
          <section className="dash-recent">
            <div className="dash-recent__header">
              <div className="dash-recent__header-left">
                <h2 className="dash-recent__title">Recent Analyses</h2>
                {pagination && (
                  <span className="dash-recent__count">
                    {pagination.totalCount} total
                  </span>
                )}
              </div>

              {/* Pagination controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="dash-pagination">
                  <button
                    className="dash-pagination__btn"
                    onClick={() => setCurrentPage((p) => p - 1)}
                    disabled={!pagination.hasPrevPage || analysesLoading}
                    aria-label="Previous page"
                  >
                    <svg
                      width="13"
                      height="13"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                    >
                      <line x1="19" y1="12" x2="5" y2="12" />
                      <polyline points="12 19 5 12 12 5" />
                    </svg>
                  </button>

                  <span className="dash-pagination__info">
                    {pagination.currentPage}
                    <span className="dash-pagination__sep">/</span>
                    {pagination.totalPages}
                  </span>

                  <button
                    className="dash-pagination__btn"
                    onClick={() => setCurrentPage((p) => p + 1)}
                    disabled={!pagination.hasNextPage || analysesLoading}
                    aria-label="Next page"
                  >
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
              )}
            </div>

            {/* List */}
            {analysesLoading ? (
              <div className="dash-analyses-loading">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="dash-analysis-card-skel" style={{ animationDelay: `${i * 0.06}s` }}>
                    <div className="skel skel--circle" />
                    <div className="dash-analysis-card-skel__info">
                      <div className="skel skel--line skel--w60" />
                      <div className="skel skel--line skel--w40" style={{ marginTop: 6 }} />
                      <div className="dash-analysis-card-skel__tags">
                        <div className="skel skel--pill" />
                        <div className="skel skel--pill" />
                        <div className="skel skel--pill" />
                      </div>
                    </div>
                    <div className="dash-analysis-card-skel__meta">
                      <div className="skel skel--line skel--w50" />
                      <div className="skel skel--pill" style={{ marginTop: 8 }} />
                    </div>
                  </div>
                ))}
              </div>
            ) : analyses.length === 0 ? (
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
                    style={{ animationDelay: `${i * 0.07}s` }}
                    onClick={() => navigate(`/interview/${item.id}`)}
                  >
                    <ScoreRing score={item.score} />

                    <div className="dash-analysis-card__info">
                      <p className="dash-analysis-card__role">{item.role}</p>
                      <div className="dash-analysis-card__tags">
                        {item.tags.map((tag) => (
                          <span key={tag} className="dash-tag">{tag}</span>
                        ))}
                      </div>
                    </div>

                    <div className="dash-analysis-card__meta">
                      <p className="dash-analysis-card__date">{item.date}</p>
                      <span className={`dash-badge dash-badge--${item.status}`}>
                        {item.status === "high"
                          ? "Strong"
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
        </div>
      </main>
    </div>
  );
}

export default Dashboard;