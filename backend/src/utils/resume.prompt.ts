/**
 * BuildResumePrompt
 * Constructs the full Claude prompt for generating a styled resume HTML page.
 * Takes the full report document and returns a prompt string.
 */
export const BuildResumePrompt = (report: InterviewReport) => {
  const {
    resume,
    jobDescription,
    userDescription,
    skillGaps,
    strengths,
    improvements,
    preparationPlan,
    sectionScores,
  } = report;

  // Summarise completed prep plan into readable lines
  const completedDays = (preparationPlan?.plan ?? []).filter(
    (d) => d.isCompleted
  );
  const prepSummary =
    completedDays.length > 0
      ? completedDays
          .map(
            (d) =>
              `  • Day ${d.day} — ${d.focus}: ${d.tasks.map((t) => t.task).join(", ")}`
          )
          .join("\n")
      : "  (none)";

  const skillGapLines =
    skillGaps?.length > 0
      ? skillGaps
          .map(
            (g) => `  • ${g.skill} (${g.severity} severity): ${g.explanation}`
          )
          .join("\n")
      : "  (none)";

  return `You are an expert resume writer and senior career coach with 15+ years of experience crafting ATS-optimised, visually polished resumes that get interviews.

Your task: produce a COMPLETE, self-contained, single-file HTML resume page.
The HTML will be fed directly into Puppeteer to render a PDF — so it must be print-ready and fully self-contained (all CSS inlined in a <style> tag, no external resources except Google Fonts via @import).

═══════════════════════════════════════════════════════
INPUT DATA
═══════════════════════════════════════════════════════

── ORIGINAL RESUME ──────────────────────────────────
${resume}

── TARGET JOB DESCRIPTION ───────────────────────────
${jobDescription}

── CANDIDATE BACKGROUND ─────────────────────────────
${userDescription}

── ANALYSIS SCORES ──────────────────────────────────
Technical:     ${sectionScores?.technical ?? "N/A"}/100
Behavioral:    ${sectionScores?.behavioral ?? "N/A"}/100
Communication: ${sectionScores?.communication ?? "N/A"}/100

── IDENTIFIED STRENGTHS ─────────────────────────────
${strengths?.map((s) => `  • ${s}`).join("\n") ?? "  (none)"}

── AREAS FOR IMPROVEMENT ────────────────────────────
${improvements?.map((s) => `  • ${s}`).join("\n") ?? "  (none)"}

── SKILL GAPS IDENTIFIED ────────────────────────────
${skillGapLines}

── COMPLETED PREPARATION PLAN ───────────────────────
The candidate actively completed the following study tasks before this resume was generated:
${prepSummary}

═══════════════════════════════════════════════════════
RESUME WRITING INSTRUCTIONS
═══════════════════════════════════════════════════════

Content rules:
1. Rewrite every experience bullet with a strong action verb + quantified result where the original data allows it. Do NOT fabricate metrics.
2. Rewrite the professional summary (3-4 sentences) to speak directly to the target role using JD language.
3. Prioritise skills that appear in the JD. Group into logical categories (e.g. Frontend, Backend, DevOps, Tools).
4. Add a dedicated "Professional Development" section that lists what the candidate completed in the prep plan — written as achievements, e.g. "Completed focused study on system design and scalability patterns".
5. Keep ALL factual details accurate: companies, titles, dates, institutions. Never invent anything.
6. Remove filler phrases ("responsible for", "helped with", "worked on"). Replace with impact-driven language.
7. If projects exist in the original resume, keep and strengthen them.

Design rules:
1. Clean, modern, single-column layout. ATS-friendly — no tables, no columns, no text boxes.
2. Use Google Fonts: import "Inter" for body and "Space Grotesk" for name/headings.
3. Font sizes: name 26-28pt, section headers 8pt uppercase tracked, body 9.5-10pt.
4. Colour palette: white background, near-black text (#0f0f0e), muted grey for secondary text (#5a5a58), a single subtle accent colour derived from the industry (e.g. a soft blue for tech, soft green for finance — your creative choice, used sparingly on section dividers or the name).
5. Generous whitespace. Section titles followed by a thin 1px divider line.
6. Each experience entry: role title (bold) + company · location on the left, date range on the right. Bullets indented below with an en-dash.
7. A4 page size. All padding/margins must keep content well within printable area.
8. Use @media print rules to ensure the PDF renders cleanly.
9. -webkit-print-color-adjust: exact on html and body.

═══════════════════════════════════════════════════════
OUTPUT RULES — CRITICAL
═══════════════════════════════════════════════════════

• Return ONLY the raw HTML. Start your response with <!DOCTYPE html> and end with </html>.
• Do NOT include any explanation, commentary, or markdown fences before or after the HTML.
• Do NOT wrap the HTML in \`\`\`html ... \`\`\`.
• All CSS must be inside a single <style> tag in <head>. No inline style attributes except for minor one-off overrides.
• All content must be inside a <div class="page"> inside <body>.
• The document must be completely self-contained — Puppeteer will render it with no internet access except Google Fonts.`;
};