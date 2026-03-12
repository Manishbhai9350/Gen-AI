import React from "react";
import "./scss/loader.scss";

// ── Types ─────────────────────────────────────────────────────────────────────
export type LoadingVariant =
  | "dashboard"
  | "interview"
  | "new-interview"
  | "fullscreen";

interface LoaderProps {
  message?: string;
  variant?: LoadingVariant;
}

// ── Skeleton primitives ───────────────────────────────────────────────────────
const Skeleton = ({
  width,
  height,
  radius,
  style,
}: {
  width?: string | number;
  height?: string | number;
  radius?: string | number;
  style?: React.CSSProperties;
}) => (
  <div
    className="skel"
    style={{
      width: width ?? "100%",
      height: height ?? 14,
      borderRadius: radius ?? 6,
      ...style,
    }}
  />
);

// ── Dashboard placeholder ─────────────────────────────────────────────────────
const DashboardSkeleton = () => (
  <div className="sk-dashboard">
    {/* Navbar */}
    <div className="sk-nav">
      <div className="sk-nav__left">
        <Skeleton width={32} height={32} radius={8} />
        <Skeleton width={80} height={14} />
      </div>
      <div className="sk-nav__right">
        <Skeleton width={90} height={32} radius={8} />
        <Skeleton width={32} height={32} radius="50%" />
      </div>
    </div>

    <div className="sk-dashboard__body">
      {/* Hero */}
      <div className="sk-hero">
        <div className="sk-hero__left">
          <Skeleton width={120} height={10} />
          <Skeleton width={220} height={28} style={{ marginTop: 12 }} />
          <Skeleton width={180} height={28} style={{ marginTop: 8 }} />
          <Skeleton width={340} height={13} style={{ marginTop: 14 }} />
          <Skeleton width={280} height={13} style={{ marginTop: 6 }} />
        </div>
        <Skeleton width={148} height={46} radius={8} />
      </div>

      {/* Stats row */}
      <div className="sk-stats">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="sk-stat-card">
            <Skeleton width={80} height={10} />
            <Skeleton width={60} height={28} style={{ marginTop: 10 }} />
            <Skeleton width={100} height={10} style={{ marginTop: 8 }} />
          </div>
        ))}
      </div>

      {/* Recent analyses header */}
      <div className="sk-section-header">
        <Skeleton width={140} height={16} />
        <Skeleton width={60} height={12} />
      </div>

      {/* Analysis cards */}
      <div className="sk-cards">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="sk-analysis-card"
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <Skeleton width={54} height={54} radius="50%" />
            <div className="sk-analysis-card__info">
              <Skeleton width={160} height={14} />
              <Skeleton width={100} height={11} style={{ marginTop: 6 }} />
              <div className="sk-tags">
                <Skeleton width={52} height={20} radius={100} />
                <Skeleton width={68} height={20} radius={100} />
                <Skeleton width={44} height={20} radius={100} />
              </div>
            </div>
            <div className="sk-analysis-card__meta">
              <Skeleton width={72} height={10} />
              <Skeleton width={52} height={22} radius={100} style={{ marginTop: 8 }} />
            </div>
            <Skeleton width={20} height={20} radius={4} />
          </div>
        ))}
      </div>
    </div>
  </div>
);

// ── Interview page skeleton ────────────────────────────────────────────────────
const InterviewSkeleton = () => (
  <div className="sk-interview">
    {/* Navbar */}
    <div className="sk-nav">
      <div className="sk-nav__left">
        <Skeleton width={32} height={32} radius={8} />
        <Skeleton width={80} height={14} />
      </div>
      <div className="sk-nav__right">
        <Skeleton width={90} height={32} radius={8} />
        <Skeleton width={32} height={32} radius="50%" />
      </div>
    </div>

    <div className="sk-interview__body">
      {/* ── Hero card ── */}
      <div className="sk-ip-hero">
        {/* top bar */}
        <div className="sk-ip-hero__topbar">
          <Skeleton width={160} height={12} radius={100} />
          <Skeleton width={120} height={10} />
        </div>

        {/* center — score block + title */}
        <div className="sk-ip-hero__center">
          <Skeleton width={116} height={88} radius={14} />
          <div className="sk-ip-hero__title-block">
            <Skeleton width="55%" height={28} />
            <Skeleton width="40%" height={28} style={{ marginTop: 8 }} />
          </div>
        </div>

        {/* stats strip */}
        <div className="sk-ip-hero__stats">
          {[...Array(4)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="sk-ip-stat">
                <Skeleton width={36} height={20} />
                <Skeleton width={56} height={9} style={{ marginTop: 5 }} />
              </div>
              {i < 3 && <div className="sk-ip-stat-divider" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="sk-section-lbl" style={{ marginTop: 24 }}>
        <Skeleton width={16} height={1} />
        <Skeleton width={72} height={9} />
      </div>

      {/* ── Overview grid ── */}
      <div className="sk-ip-overview">
        {/* Score ring card */}
        <div className="sk-ip-card sk-ip-ring-card">
          <Skeleton width={140} height={140} radius="50%" />
          <Skeleton width={80} height={9} style={{ marginTop: 14 }} />
        </div>

        {/* Section breakdown card */}
        <div className="sk-ip-card">
          <Skeleton width={120} height={9} style={{ marginBottom: 18 }} />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="sk-ip-bar-row" style={{ marginTop: i === 0 ? 0 : 16 }}>
              <div className="sk-ip-bar-header">
                <Skeleton width={80} height={10} />
                <Skeleton width={32} height={10} />
              </div>
              <Skeleton width="100%" height={6} radius={100} style={{ marginTop: 7 }} />
            </div>
          ))}
        </div>
      </div>

      {/* ── Section label ── */}
      <div className="sk-section-lbl" style={{ marginTop: 24 }}>
        <Skeleton width={16} height={1} />
        <Skeleton width={56} height={9} />
      </div>

      {/* ── Insights two-col ── */}
      <div className="sk-ip-two-col">
        {[0, 1].map((col) => (
          <div key={col} className="sk-ip-card">
            <Skeleton width={100} height={9} style={{ marginBottom: 18 }} />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="sk-ip-insight-item" style={{ marginTop: i === 0 ? 0 : 8 }}>
                <Skeleton width={20} height={20} radius={6} />
                <div style={{ flex: 1 }}>
                  <Skeleton width="85%" height={11} />
                  <Skeleton width="60%" height={11} style={{ marginTop: 5 }} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Section label ── */}
      <div className="sk-section-lbl" style={{ marginTop: 24 }}>
        <Skeleton width={16} height={1} />
        <Skeleton width={72} height={9} />
      </div>

      {/* ── Skill gaps full card ── */}
      <div className="sk-ip-card sk-ip-card--full">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="sk-ip-gap-item"
            style={{ borderTop: i === 0 ? "none" : undefined, paddingTop: i === 0 ? 0 : 18 }}
          >
            <div className="sk-ip-gap-header">
              <Skeleton width={110} height={13} />
              <Skeleton width={64} height={20} radius={100} />
            </div>
            <Skeleton width="90%" height={11} style={{ marginTop: 6 }} />
            <Skeleton width="70%" height={11} style={{ marginTop: 4 }} />
          </div>
        ))}
      </div>

      {/* ── Section label ── */}
      <div className="sk-section-lbl" style={{ marginTop: 24 }}>
        <Skeleton width={16} height={1} />
        <Skeleton width={112} height={9} />
      </div>

      {/* ── Questions two-col ── */}
      <div className="sk-ip-two-col">
        {[0, 1].map((col) => (
          <div key={col} className="sk-ip-card">
            <Skeleton width={90} height={9} style={{ marginBottom: 18 }} />
            {[...Array(3)].map((_, i) => (
              <div key={i} className="sk-ip-q-item" style={{ paddingTop: i === 0 ? 0 : 16, borderTop: i === 0 ? "none" : undefined }}>
                <Skeleton width="90%" height={11} />
                <Skeleton width="75%" height={11} style={{ marginTop: 5 }} />
                <div className="sk-ip-q-meta">
                  <Skeleton width={52} height={18} radius={100} />
                  {col === 0 && <Skeleton width={44} height={18} radius={100} />}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* ── Section label ── */}
      <div className="sk-section-lbl" style={{ marginTop: 24 }}>
        <Skeleton width={16} height={1} />
        <Skeleton width={120} height={9} />
      </div>

      {/* ── Prep plan card ── */}
      <div className="sk-ip-card sk-ip-card--full sk-ip-prep">
        {/* header */}
        <div className="sk-ip-prep__header">
          <div>
            <Skeleton width={160} height={13} />
            <Skeleton width={120} height={9} style={{ marginTop: 6 }} />
          </div>
          <div className="sk-ip-prep__bar-wrap">
            <Skeleton width="100%" height={6} radius={100} />
            <Skeleton width={28} height={10} style={{ marginTop: 4 }} />
          </div>
        </div>

        {/* day tabs */}
        <div className="sk-ip-day-tabs">
          {[...Array(3)].map((_, i) => (
            <Skeleton
              key={i}
              width={88}
              height={34}
              radius={8}
              style={{ animationDelay: `${i * 0.06}s` }}
            />
          ))}
        </div>

        {/* active day panel */}
        <div className="sk-ip-day-panel">
          <div className="sk-ip-day-panel__header">
            <div>
              <Skeleton width={40} height={9} />
              <Skeleton width={140} height={18} style={{ marginTop: 6 }} />
            </div>
            <Skeleton width={36} height={36} radius="50%" />
          </div>
          {[...Array(2)].map((_, i) => (
            <Skeleton
              key={i}
              width="100%"
              height={48}
              radius={8}
              style={{ marginTop: i === 0 ? 0 : 8 }}
            />
          ))}
        </div>

        {/* export btn */}
        <div className="sk-ip-export">
          <Skeleton width={120} height={36} radius={8} />
        </div>
      </div>
    </div>
  </div>
);

// ── New Interview page skeleton ────────────────────────────────────────────────
const NewInterviewSkeleton = () => (
  <div className="sk-new-interview">
    {/* Navbar */}
    <div className="sk-nav">
      <div className="sk-nav__left">
        <Skeleton width={32} height={32} radius={8} />
        <Skeleton width={80} height={14} />
      </div>
      <div className="sk-nav__right">
        <Skeleton width={90} height={32} radius={8} />
        <Skeleton width={32} height={32} radius="50%" />
      </div>
    </div>

    <div className="sk-ni-wrapper">
      <div className="sk-ni-container">
        {/* ── Header ── */}
        <div className="sk-ni-header">
          <Skeleton width={120} height={28} radius={100} style={{ margin: "0 auto" }} />
          <Skeleton width={260} height={28} style={{ margin: "20px auto 0" }} />
          <Skeleton width={200} height={28} style={{ margin: "8px auto 0" }} />
          <Skeleton width={340} height={13} style={{ margin: "14px auto 0" }} />
          <Skeleton width={280} height={13} style={{ margin: "6px auto 0" }} />
        </div>

        {/* ── Step indicators ── */}
        <div className="sk-ni-steps">
          {[...Array(3)].map((_, i) => (
            <React.Fragment key={i}>
              <div className="sk-ni-step">
                <Skeleton width={28} height={28} radius="50%" />
                <Skeleton width={56} height={9} style={{ marginTop: 6 }} />
              </div>
              {i < 2 && <Skeleton width={40} height={1} style={{ marginBottom: 14 }} />}
            </React.Fragment>
          ))}
        </div>

        {/* ── Form sections ── */}
        <div className="sk-ni-form">
          {/* Section 01 — Resume / Dropzone */}
          <div className="sk-ni-section" style={{ animationDelay: "0.08s" }}>
            <div className="sk-ni-section__header">
              <Skeleton width={20} height={11} />
              <div>
                <Skeleton width={80} height={14} />
                <Skeleton width={120} height={10} style={{ marginTop: 5 }} />
              </div>
            </div>
            {/* dropzone */}
            <div className="sk-ni-dropzone">
              <Skeleton width={52} height={52} radius={10} />
              <Skeleton width={160} height={13} style={{ marginTop: 12 }} />
              <Skeleton width={80} height={9} style={{ marginTop: 8 }} />
              <Skeleton width={100} height={32} radius={8} style={{ marginTop: 10 }} />
            </div>
          </div>

          {/* Section 02 — Job Description */}
          <div className="sk-ni-section" style={{ animationDelay: "0.16s" }}>
            <div className="sk-ni-section__header">
              <Skeleton width={20} height={11} />
              <div>
                <Skeleton width={120} height={14} />
                <Skeleton width={180} height={10} style={{ marginTop: 5 }} />
              </div>
            </div>
            <Skeleton width="100%" height={120} radius={8} />
          </div>

          {/* Section 03 — About You */}
          <div className="sk-ni-section" style={{ animationDelay: "0.24s" }}>
            <div className="sk-ni-section__header">
              <Skeleton width={20} height={11} />
              <div>
                <Skeleton width={80} height={14} />
                <Skeleton width={200} height={10} style={{ marginTop: 5 }} />
              </div>
            </div>
            <Skeleton width="100%" height={96} radius={8} />
          </div>

          {/* Submit */}
          <div className="sk-ni-submit">
            <Skeleton width={168} height={44} radius={8} />
            <Skeleton width={220} height={10} style={{ marginTop: 12 }} />
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ── Fullscreen spinner ────────────────────────────────────────────────────────
const FullscreenLoader = ({ message }: { message: string }) => (
  <div className="sk-fullscreen">
    <div className="sk-fullscreen__spinner">
      <div className="sk-fullscreen__ring" />
      <div className="sk-fullscreen__ring sk-fullscreen__ring--2" />
    </div>
    <p className="sk-fullscreen__message">{message}</p>
  </div>
);

// ── Main export ───────────────────────────────────────────────────────────────
const Loader: React.FC<LoaderProps> = ({
  message = "Loading...",
  variant = "fullscreen",
}) => {
  if (variant === "dashboard") return <DashboardSkeleton />;
  if (variant === "interview") return <InterviewSkeleton />;
  if (variant === "new-interview") return <NewInterviewSkeleton />;
  return <FullscreenLoader message={message} />;
};

export default Loader;