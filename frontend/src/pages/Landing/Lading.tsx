import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "./scss/landing.scss";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useUser } from "../../context/user/user.context";
import Navbar from "../../components/navbar/navbar";

// ── Types ─────────────────────────────────────────────────────────────────────
type ProcessStep = 0 | 1 | 2 | 3;

// ── Data ──────────────────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "01",
    title: "Upload Your Resume",
    desc: "Drag & drop your PDF or Word file. Our parser handles any format — no reformatting needed on your end.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="12" y1="12" x2="12" y2="18" />
        <line x1="9" y1="15" x2="15" y2="15" />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Paste Job Description",
    desc: "Copy the job listing from LinkedIn, Indeed, or any site. Paste it in — the AI handles the rest.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <line x1="3" y1="9" x2="21" y2="9" />
        <line x1="9" y1="21" x2="9" y2="9" />
      </svg>
    ),
  },
  {
    num: "03",
    title: "AI Processes & Analyses",
    desc: "Jobsync cross-references your profile against the role, scans ATS keywords, and scores every dimension of fit.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
      </svg>
    ),
  },
  {
    num: "04",
    title: "Get Your Full Report",
    desc: "Download a detailed PDF: match score, skill gaps, ATS keywords, AI rewrite suggestions, and a full action plan.",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <polyline points="16 13 12 17 8 13" />
        <line x1="12" y1="17" x2="12" y2="9" />
      </svg>
    ),
  },
];

const FEATURES = [
  {
    title: "ATS Keyword Scanner",
    desc: "Find every keyword the job description uses that's missing from your resume — before an ATS filters you out.",
    color: "accent",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
  {
    title: "Match Score",
    desc: "Get a 0–100 compatibility score for every role. Know if you're a strong, average, or weak match before you apply.",
    color: "green",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
      </svg>
    ),
  },
  {
    title: "Skill Gap Analysis",
    desc: "Side-by-side breakdown of your skills vs. role requirements. Every gap flagged with suggestions to address it.",
    color: "blue",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z" />
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z" />
      </svg>
    ),
  },
  {
    title: "AI Rewrite Suggestions",
    desc: "Weak bullet points rewritten into strong, achievement-driven statements that actually land interviews.",
    color: "purple",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
      </svg>
    ),
  },
  {
    title: "PDF Export",
    desc: "Download your complete analysis as a formatted PDF. Share with mentors, coaches, or keep it for reference.",
    color: "amber",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    title: "Application History",
    desc: "Track every analysis in one dashboard. Watch your score improve and see what's actually working.",
    color: "red",
    icon: (
      <svg
        width="18"
        height="18"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" />
        <path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
];

const TESTIMONIALS = [
  {
    text: "Applied to 40 jobs, got 3 callbacks. Ran Jobsync, optimized my resume, got 6 interviews from my next 12 applications. The keyword gap analysis is genuinely insane.",
    name: "Arjun K.",
    role: "Software Engineer · Hired at Razorpay",
    initials: "AK",
    color: "green",
  },
  {
    text: "The skill gap section was a wake-up call. My resume never said 'cross-functional' even though I do it daily. Fixed it. Got 2 offers in 3 weeks.",
    name: "Sneha R.",
    role: "Product Manager · Hired at Flipkart",
    initials: "SR",
    color: "accent",
  },
  {
    text: "Scored 54 on a role I really wanted. Made the changes Jobsync suggested, re-ran it, got 81. Had the interview a week later. Worth every rupee.",
    name: "Mihir T.",
    role: "Frontend Dev · Hired at Groww",
    initials: "MT",
    color: "blue",
  },
];

const TICKER_ITEMS = [
  { text: "match score", highlight: "87%" },
  { text: "Google · Senior Engineer", highlight: null },
  { text: "more callbacks", highlight: "+34%" },
  { text: "ATS keyword scanner", highlight: null },
  { text: "Stripe · Product Manager", highlight: null },
  { text: "to results", highlight: "10 seconds" },
  { text: "Skill gap analysis", highlight: null },
  { text: "Razorpay · Frontend Dev", highlight: null },
  { text: "AI rewrite suggestions", highlight: null },
  { text: "Instant PDF export", highlight: null },
  { text: "Groww · Staff Engineer", highlight: null },
  { text: "ATS pass rate", highlight: "92%" },
];

// ── Preview Panel ─────────────────────────────────────────────────────────────
const PREVIEW_TITLES = [
  "jobsync — ready",
  "step 01 — upload",
  "step 02 — job description",
  "step 03 — ai processing",
  "step 04 — report ready",
];

const PreviewIdle = () => (
  <div className="pv-idle">
    <div className="pv-idle__icon">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      >
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
    </div>
    <p>Upload your resume to begin</p>
  </div>
);

const PreviewUpload = () => (
  <div className="pv-upload">
    <div className="pv-upload__zone">
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
      >
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>
      <span className="uz-title">resume_alex_k.pdf</span>
      <span className="uz-sub">Uploading... ████████░░ 80%</span>
    </div>
    <div className="pv-upload__file">
      <div className="file-ext">PDF</div>
      <div className="file-info">
        <span className="fn">resume_alex_k.pdf</span>
        <span className="fs">248 KB · Uploaded ✓</span>
      </div>
    </div>
  </div>
);

const PreviewJD = () => (
  <div className="pv-jd">
    <div className="pv-jd__field">
      <div className="jd-label">Job Description</div>
      <div className="jd-lines">
        <div className="jd-line" style={{ width: "100%" }} />
        <div className="jd-line" style={{ width: "85%" }} />
        <div className="jd-line jd-line--accent" />
        <div className="jd-line" style={{ width: "90%" }} />
        <div className="jd-line" style={{ width: "70%" }} />
        <div className="jd-line jd-line--accent" style={{ width: "55%" }} />
      </div>
    </div>
    <div className="pv-jd__field">
      <div className="jd-label">About You</div>
      <div className="jd-lines">
        <div className="jd-line" style={{ width: "95%" }} />
        <div className="jd-line" style={{ width: "80%" }} />
        <div className="jd-line" style={{ width: "60%" }} />
      </div>
    </div>
  </div>
);

const PreviewProcessing = () => (
  <div className="pv-processing">
    <div className="pv-processing__spinner">
      <div className="ring" />
      <div className="ring ring--2" />
    </div>
    <div className="pv-processing__steps">
      {[
        "Parsing resume structure...",
        "Scanning ATS keywords...",
        "Scoring skill alignment...",
        "Building your report...",
      ].map((s, i) => (
        <div
          key={s}
          className="proc-step"
          style={{ animationDelay: `${i * 0.65}s` }}
        >
          <span className="proc-dot" />
          {s}
        </div>
      ))}
    </div>
  </div>
);

const PreviewResult = () => {
  const circ = 2 * Math.PI * 32;
  const fill = (87 / 100) * circ;
  return (
    <div className="pv-result">
      <div className="pv-result__top">
        <div className="score-ring">
          <svg width="80" height="80" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="var(--bg-inset)"
              strokeWidth="5"
            />
            <circle
              cx="40"
              cy="40"
              r="32"
              fill="none"
              stroke="var(--green)"
              strokeWidth="5"
              strokeDasharray={`${fill} ${circ}`}
              strokeLinecap="round"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="score-ring__val">
            <span className="num">87</span>
            <span className="lbl">/100</span>
          </div>
        </div>
        <div className="res-meta">
          <p className="res-role">Senior Frontend Engineer</p>
          <p className="res-co">Stripe · San Francisco</p>
          <span className="res-badge">
            <svg
              width="8"
              height="8"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
            Strong Match
          </span>
        </div>
      </div>
      <div className="pv-result__bars">
        {[
          { label: "React / TypeScript", val: 92, color: "var(--green)" },
          { label: "System Design", val: 74, color: "var(--accent)" },
          { label: "ATS Keywords", val: 89, color: "var(--green)" },
          { label: "Leadership Signal", val: 58, color: "var(--amber)" },
        ].map((bar, i) => (
          <div key={bar.label} className="res-bar">
            <div className="res-bar__head">
              <span>{bar.label}</span>
              <span style={{ color: bar.color }}>{bar.val}%</span>
            </div>
            <div className="res-bar__track">
              <div
                className="res-bar__fill"
                style={{
                  width: `${bar.val}%`,
                  background: bar.color,
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const Landing = () => {
  const [activeStep, setActiveStep] = useState<number>(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const sectionRef = useRef<HTMLElement | null>(null);

  const { user, refreshUser, isLoading } = useUser();

  console.log(user);

  useEffect(() => {
    refreshUser();

    return () => {};
  }, []);

  // scroll reveal
  useGSAP(() => {
    const obs = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        }),
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // navbar scroll shadow
  useEffect(() => {
    const nav = document.getElementById("landing-nav");
    const onScroll = () =>
      nav?.classList.toggle("scrolled", window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  //   // process section scroll trigger
  //   useEffect(() => {
  //     const stepObs = new IntersectionObserver(
  //       (entries) => {
  //         entries.forEach((entry) => {
  //           if (entry.isIntersecting) {
  //             const idx = stepRefs.current.indexOf(
  //               entry.target as HTMLDivElement,
  //             );
  //             if (idx !== -1) setActiveStep(idx);
  //           }
  //         });
  //       },
  //       { threshold: 0.6, rootMargin: "-10% 0px -30% 0px" },
  //     );

  //     const sectionObs = new IntersectionObserver(
  //       (entries) => {
  //         entries.forEach((e) => {
  //           if (!e.isIntersecting) setActiveStep(-1);
  //         });
  //       },
  //       { threshold: 0 },
  //     );

  //     stepRefs.current.forEach((el) => el && stepObs.observe(el));
  //     if (sectionRef.current) sectionObs.observe(sectionRef.current);

  //     return () => {
  //       stepObs.disconnect();
  //       sectionObs.disconnect();
  //     };
  //   }, []);

  useGSAP(() => {
    const trigger = ScrollTrigger.create({
      trigger: ".process-section",
      //   markers: true,
      start: "top top",
      end: "+=40%",
      onUpdate({ progress }) {
        const ActiveStepper = Math.floor(progress / 0.25) - 1 || 0;
        setActiveStep(ActiveStepper);
      },
    });

    return () => {
      trigger.kill();
    };
  });

  const getStepClass = (idx: number) => {
    if (idx < activeStep) return "step-item step-item--done";
    if (idx === activeStep) return "step-item step-item--active";
    return "step-item";
  };

  // preview state: -1 → idle, 0-3 → step previews
  const previewState = activeStep;
  const previewTitle = PREVIEW_TITLES[previewState + 1] ?? PREVIEW_TITLES[0];

  return (
    <div className="landing">
      {/* ── NAV ── */}
      <Navbar userName={user ? user.name : ''} />

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero__grid" />
        <div className="hero__glow-a" />
        <div className="hero__glow-b" />
        <div className="hero__inner">
          <div className="hero__badge">
            <span className="badge-dot" />
            AI-Powered Resume Intelligence
          </div>
          <h1 className="hero__title">
            Stop guessing why
            <br />
            <span className="hero__title--accent">
              you're not getting hired.
            </span>
          </h1>
          <p className="hero__sub">
            Jobsync scores your resume against any job posting, finds every gap,
            and tells you exactly what to fix. Powered by AI. Done in seconds.
          </p>
          <div className="hero__actions">
            <Link to="/interview/new" className="hero__cta">
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
              >
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Analyze My Resume — Free
            </Link>
            <a href="#how" className="hero__ghost">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" fill="currentColor" />
              </svg>
              See How It Works
            </a>
          </div>
          <div className="hero__proof">
            <div className="proof-avatars">
              <div className="av av--green">AK</div>
              <div className="av av--blue">SR</div>
              <div className="av av--accent">MT</div>
              <div className="av av--purple">NP</div>
            </div>
            <span>Trusted by 2,400+ job seekers this month</span>
          </div>
        </div>
      </section>

      {/* ── TICKER ── */}
      <div className="ticker">
        <div className="ticker__track">
          {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
            <div key={i} className="ticker__item">
              {item.highlight && <b>{item.highlight}</b>}
              {item.text}
              <span className="ticker__sep" />
            </div>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="section process-section" id="how" ref={sectionRef}>
        <div className="container">
          <div className="reveal">
            <div className="eyebrow">How it works</div>
            <h2 className="section-title">
              Resume to report
              <br />
              in 4 simple steps
            </h2>
            <p className="section-sub">
              No 20-step onboarding. Upload, describe, and get your full
              AI-powered analysis instantly.
            </p>
          </div>

          <div className="process-layout">
            {/* Stepper */}
            <div className="stepper reveal" style={{ transitionDelay: "0.1s" }}>
              {STEPS.map((step, i) => (
                <div
                  key={step.num}
                  className={getStepClass(i)}
                  ref={(el) => {
                    stepRefs.current[i] = el;
                  }}
                >
                  <div className="step-node">{step.icon}</div>
                  <div className="step-body">
                    <div className="step-num">Step {step.num}</div>
                    <div className="step-title">{step.title}</div>
                    <div className="step-desc">{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Preview panel */}
            <div
              className="process-preview reveal"
              style={{ transitionDelay: "0.2s" }}
            >
              <div className="preview-panel">
                <div className="preview-topbar">
                  <div className="topbar-dots">
                    <span className="dot dot--red" />
                    <span className="dot dot--amber" />
                    <span className="dot dot--green" />
                  </div>
                  <span className="topbar-title">{previewTitle}</span>
                </div>
                <div className="preview-body">
                  {previewState === -1 && <PreviewIdle />}
                  {previewState === 0 && <PreviewUpload />}
                  {previewState === 1 && <PreviewJD />}
                  {previewState === 2 && <PreviewProcessing />}
                  {previewState === 3 && <PreviewResult />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <div className="stats-band reveal">
        <div className="container">
          <div className="stats-grid">
            {[
              { num: "2.4K", label: "Resumes Analyzed" },
              { num: "+34%", label: "More Interviews" },
              { num: "10s", label: "Avg. Report Time" },
              { num: "4.9★", label: "User Rating" },
            ].map((s) => (
              <div key={s.label} className="stat-cell">
                <div className="stat-num">{s.num}</div>
                <div className="stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section className="section features-section" id="features">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="eyebrow eyebrow--center">Features</div>
            <h2 className="section-title">
              Everything you need
              <br />
              to get hired faster
            </h2>
            <p className="section-sub section-sub--center">
              No more guessing why you're not getting callbacks. Jobsync shows
              exactly what's holding you back.
            </p>
          </div>
          <div className="features-grid">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={`feat-card feat-card--${f.color} reveal`}
                style={{ transitionDelay: `${(i % 3) * 0.07}s` }}
              >
                <div className="feat-icon">{f.icon}</div>
                <div className="feat-title">{f.title}</div>
                <div className="feat-desc">{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section" id="reviews">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="eyebrow eyebrow--center">Reviews</div>
            <h2 className="section-title">Real results, real people</h2>
            <p className="section-sub section-sub--center">
              Job seekers who used Jobsync and got the interviews they were
              missing.
            </p>
          </div>
          <div className="testi-grid">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={t.name}
                className="testi-card reveal"
                style={{ transitionDelay: `${i * 0.08}s` }}
              >
                <div className="testi-stars">★★★★★</div>
                <p className="testi-text">"{t.text}"</p>
                <div className="testi-author">
                  <div className={`testi-av testi-av--${t.color}`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="section pricing-section" id="pricing">
        <div className="container">
          <div className="reveal" style={{ textAlign: "center" }}>
            <div className="eyebrow eyebrow--center">Pricing</div>
            <h2 className="section-title">Simple, honest pricing</h2>
            <p className="section-sub section-sub--center">
              Start free. Upgrade when you need more. No hidden fees, no
              surprise charges.
            </p>
          </div>
          <div
            className="pricing-grid reveal"
            style={{ transitionDelay: "0.1s" }}
          >
            {/* Starter */}
            <div className="price-card">
              <div className="price-plan">Starter</div>
              <div className="price-amount">
                <span className="cur">₹</span>
                <span className="amt">0</span>
                <span className="per">/mo</span>
              </div>
              <p className="price-desc">Try it out. No card required.</p>
              <div className="price-divider" />
              <ul className="price-feats">
                {[
                  "5 analyses / month",
                  "Match score + skill gaps",
                  "ATS keyword check",
                  "Dashboard history",
                ].map((f) => (
                  <li key={f}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/signup" className="price-btn price-btn--ghost">
                Get Started Free
              </Link>
            </div>
            {/* Pro */}
            <div className="price-card price-card--hot">
              <div className="price-hot-badge">Most Popular</div>
              <div className="price-plan">Pro</div>
              <div className="price-amount">
                <span className="cur">₹</span>
                <span className="amt">299</span>
                <span className="per">/mo</span>
              </div>
              <p className="price-desc">
                For active job seekers who need every edge.
              </p>
              <div className="price-divider" />
              <ul className="price-feats">
                {[
                  "50 analyses / month",
                  "Everything in Starter",
                  "AI rewrite suggestions",
                  "PDF export reports",
                  "Priority AI processing",
                ].map((f) => (
                  <li key={f}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                to="/signup?plan=pro"
                className="price-btn price-btn--accent"
              >
                Start Pro — ₹299/mo
              </Link>
            </div>
            {/* Teams */}
            <div className="price-card">
              <div className="price-plan">Teams</div>
              <div className="price-amount">
                <span className="cur">₹</span>
                <span className="amt">999</span>
                <span className="per">/mo</span>
              </div>
              <p className="price-desc">
                For bootcamps, colleges, and career coaches.
              </p>
              <div className="price-divider" />
              <ul className="price-feats">
                {[
                  "Unlimited analyses",
                  "Up to 10 members",
                  "Everything in Pro",
                  "Admin dashboard",
                  "Dedicated support",
                ].map((f) => (
                  <li key={f}>
                    <CheckIcon />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="mailto:hello@jobsync.app"
                className="price-btn price-btn--ghost"
              >
                Contact Sales
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="cta-section">
        <div className="cta-glow" />
        <div className="cta-inner reveal">
          <h2 className="cta-title">
            Your dream job is
            <br />
            <span className="cta-title--accent">one analysis away.</span>
          </h2>
          <p className="cta-sub">
            Join thousands of job seekers who stopped guessing and started
            landing interviews with Jobsync.
          </p>
          <Link to="/signup" className="hero__cta">
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Analyze My Resume — It's Free
          </Link>
          <p className="cta-note">
            No credit card · 5 free analyses · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lfooter">
        <div className="lfooter__left">
          <div className="lfooter__mark">J</div>
          <span className="lfooter__copy">
            © 2025 Jobsync. All rights reserved.
          </span>
        </div>
        <ul className="lfooter__links">
          <li>
            <a href="#">Privacy</a>
          </li>
          <li>
            <a href="#">Terms</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
      </footer>
    </div>
  );
};

const CheckIcon = () => (
  <div className="chk">
    <svg
      width="7"
      height="7"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3.5"
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  </div>
);

export default Landing;
