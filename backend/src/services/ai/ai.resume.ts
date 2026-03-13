
import { generateText, Output } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { BuildResumePrompt } from "../../utils/resume.prompt.js";


/**
 * generateResumeHTML
 * Sends the report data to Claude and returns a complete styled HTML resume string.
 *
 * @param {Object} report - The full report document from MongoDB
 * @returns {Promise<string>} - Complete self-contained HTML string
 */



const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_AI_API_KEY as string,
});


export const GenerateResumeHTML = async (report: InterviewReport) => {
  const prompt = BuildResumePrompt(report);

  const response = await generateText({
    model: google('gemini-2.5-flash'),
    prompt,
  }); 

  const raw = response.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");

  // Strip accidental markdown fences if model wraps output in ```html
  const html = raw
    .replace(/^```html\n?/, "")
    .replace(/^```\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  return html;
};