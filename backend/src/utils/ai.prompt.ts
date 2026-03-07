export const buildInterviewPrompt = (
  resume: string,
  jobDescription: string,
  userDescription: string,
) => `
You are an AI interview coach.

Resume:
${resume}

Job Description:
${jobDescription}

Candidate Description:
${userDescription}

Return ONLY valid JSON with this structure:

{
  "technicalQuestions": [],
  "behavioralQuestions": [],
  "skillGaps": [],
  "preparationPlan": {},
  "sectionScores": {},
  "overallScore": 0,
  "strengths": [],
  "improvements": []
}
`;
