import React, { useState, useRef, useCallback } from "react";
import "./scss/new-interview.scss";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Navbar from "../../components/navbar/navbar";
import axiosInstance from "../../utils/axios/axios";

type UploadState = "idle" | "dragging" | "uploaded";
type SubmitState = "idle" | "loading";

const MAX_FILE_SIZE_MB = 5;

const NewInterviewPage = () => {
  const [uploadState, setUploadState] = useState<UploadState>("idle");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [userDescription, setUserDescription] = useState("");
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const acceptedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];

  const validateFile = (file: File) => {
    if (!acceptedTypes.includes(file.type)) {
      toast.error("Only PDF or Word documents are accepted");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      toast.error("File must be under " + MAX_FILE_SIZE_MB + "MB");
      return false;
    }
    return true;
  };

  const handleFile = (file: File) => {
    if (!validateFile(file)) return;
    setResumeFile(file);
    setUploadState("uploaded");
    setErrors((prev) => ({ ...prev, resume: "" }));
  };

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setUploadState("dragging");
  }, []);

  const onDragLeave = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setUploadState(resumeFile ? "uploaded" : "idle");
    },
    [resumeFile],
  );

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
    else setUploadState("idle");
  }, []);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeFile(null);
    setUploadState("idle");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!resumeFile) newErrors.resume = "Please upload your resume";
    if (!jobDescription.trim())
      newErrors.jobDescription = "Job description is required";
    if (!userDescription.trim())
      newErrors.userDescription = "Tell us about yourself";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setSubmitState("loading");
    try {
      const formData = new FormData();
      formData.append("jobDescription", jobDescription);
      formData.append("userDescription", userDescription);
      formData.append("resume", resumeFile as File);

      const res = await axiosInstance.post("/interview/report", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Report Generated!");
      navigate(`/interview/${res.data.report._id}`);
    } catch {
      setSubmitState("idle");
      toast.error("Failed to generate report");
    }
  };

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const getFileExt = (name: string) =>
    name.split(".").pop()?.toUpperCase() ?? "FILE";

  // ── Loading / Generating screen ─────────────────────────────────────────────
  if (submitState === "loading") {
    return (
      <div className="ni-generating">
        <div className="ni-generating__inner">
          <div className="ni-generating__spinner">
            <div className="spinner-ring" />
            <div className="spinner-ring spinner-ring--2" />
            <div className="spinner-ring spinner-ring--3" />
          </div>
          <h2 className="ni-generating__title">Analyzing Resume</h2>
          <p className="ni-generating__sub">
            Our AI is cross-referencing your profile against the job
            description. This usually takes a few seconds.
          </p>
          <div className="ni-generating__steps">
            {[
              "Parsing resume",
              "Matching skills",
              "Scoring profile",
              "Building report",
            ].map((s, i) => (
              <div
                key={s}
                className="ni-step"
                style={{ animationDelay: `${i * 0.7}s` }}
              >
                <span className="ni-step__dot" />
                <span className="ni-step__label">{s}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Main form ───────────────────────────────────────────────────────────────
  return (
    <>
      <Navbar />
      <div className="ni-wrapper">
        <div className="ni-bg-glow ni-bg-glow--top" />
        <div className="ni-bg-glow ni-bg-glow--bottom" />

        <div className="ni-container">
          {/* Header */}
          <header className="ni-header">
            <div className="ni-header__badge">
              <span className="badge-dot" />
              New Session
            </div>
            <h1 className="ni-header__title">Build Your Interview Report</h1>
            <p className="ni-header__sub">
              Upload your resume and describe the role — we'll generate a
              detailed analysis in seconds.
            </p>
          </header>

          {/* Progress steps */}
          <div className="ni-steps">
            {["Resume", "Job Details", "About You"].map((label, i) => (
              <div key={label} className="ni-steps__item">
                <div className="ni-steps__num">{i + 1}</div>
                <span className="ni-steps__label">{label}</span>
                {i < 2 && <div className="ni-steps__line" />}
              </div>
            ))}
          </div>

          {/* Form sections */}
          <div className="ni-form">
            {/* ── 01 Resume ── */}
            <section className="ni-section">
              <div className="ni-section__header">
                <span className="ni-section__num">01</span>
                <div>
                  <h3 className="ni-section__title">Resume</h3>
                  <p className="ni-section__desc">
                    PDF or Word, max {MAX_FILE_SIZE_MB}MB
                  </p>
                </div>
              </div>

              <div
                className={`ni-dropzone ni-dropzone--${uploadState}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() =>
                  uploadState !== "uploaded" && fileInputRef.current?.click()
                }
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={onFileChange}
                  style={{ display: "none" }}
                />

                {uploadState === "uploaded" && resumeFile ? (
                  <div className="ni-dropzone__file">
                    <div className="ni-dropzone__file-icon">
                      <span className="file-ext">
                        {getFileExt(resumeFile.name)}
                      </span>
                    </div>
                    <div className="ni-dropzone__file-info">
                      <span className="file-name">{resumeFile.name}</span>
                      <span className="file-size">
                        {formatBytes(resumeFile.size)}
                      </span>
                    </div>
                    <button
                      className="ni-dropzone__remove"
                      onClick={removeFile}
                      title="Remove"
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <div className="ni-dropzone__empty">
                    <div className="ni-dropzone__icon">
                      {uploadState === "dragging" ? (
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                          <polyline points="17 8 12 3 7 8" />
                          <line x1="12" y1="3" x2="12" y2="15" />
                        </svg>
                      ) : (
                        <svg
                          width="30"
                          height="30"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                          <polyline points="14 2 14 8 20 8" />
                          <line x1="12" y1="12" x2="12" y2="18" />
                          <line x1="9" y1="15" x2="15" y2="15" />
                        </svg>
                      )}
                    </div>
                    <p className="ni-dropzone__text">
                      {uploadState === "dragging"
                        ? "Release to upload"
                        : "Drag & drop your resume here"}
                    </p>
                    <span className="ni-dropzone__or">or</span>
                    <button
                      className="ni-dropzone__browse"
                      onClick={(e) => {
                        e.stopPropagation();
                        fileInputRef.current?.click();
                      }}
                    >
                      Browse Files
                    </button>
                  </div>
                )}
              </div>
              {errors.resume && (
                <span className="ni-error">{errors.resume}</span>
              )}
            </section>

            {/* ── 02 Job Description ── */}
            <section className="ni-section">
              <div className="ni-section__header">
                <span className="ni-section__num">02</span>
                <div>
                  <h3 className="ni-section__title">Job Description</h3>
                  <p className="ni-section__desc">
                    Paste the full listing or summarize the role
                  </p>
                </div>
              </div>

              <div
                className={`ni-textarea-wrap ${errors.jobDescription ? "ni-textarea-wrap--error" : ""}`}
              >
                <textarea
                  className="ni-textarea"
                  value={jobDescription}
                  onChange={(e) => {
                    setJobDescription(e.target.value);
                    if (e.target.value)
                      setErrors((prev) => ({ ...prev, jobDescription: "" }));
                  }}
                  placeholder="e.g. We're looking for a Senior Frontend Engineer with 4+ years of React experience, strong TypeScript skills, and experience with design systems..."
                  rows={6}
                />
                <div className="ni-textarea__counter">
                  {jobDescription.length} chars
                </div>
              </div>
              {errors.jobDescription && (
                <span className="ni-error">{errors.jobDescription}</span>
              )}
            </section>

            {/* ── 03 About You ── */}
            <section className="ni-section">
              <div className="ni-section__header">
                <span className="ni-section__num">03</span>
                <div>
                  <h3 className="ni-section__title">About You</h3>
                  <p className="ni-section__desc">
                    Your background, strengths, and goals
                  </p>
                </div>
              </div>

              <div
                className={`ni-textarea-wrap ${errors.userDescription ? "ni-textarea-wrap--error" : ""}`}
              >
                <textarea
                  className="ni-textarea"
                  value={userDescription}
                  onChange={(e) => {
                    setUserDescription(e.target.value);
                    if (e.target.value)
                      setErrors((prev) => ({ ...prev, userDescription: "" }));
                  }}
                  placeholder="e.g. I'm a frontend developer with 3 years of experience in React and Vue. I'm passionate about UI/UX and currently transitioning into product-focused roles..."
                  rows={5}
                />
                <div className="ni-textarea__counter">
                  {userDescription.length} chars
                </div>
              </div>
              {errors.userDescription && (
                <span className="ni-error">{errors.userDescription}</span>
              )}
            </section>

            {/* ── Submit ── */}
            <div className="ni-submit">
              <button className="ni-submit__btn" onClick={handleSubmit}>
                <span className="ni-submit__btn-text">Generate Report</span>
                <span className="ni-submit__btn-icon">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                  >
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </span>
              </button>
              <p className="ni-submit__note">
                Analysis typically completes in under 10 seconds
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewInterviewPage;
