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

`;
