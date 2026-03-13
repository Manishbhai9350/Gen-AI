import puppeteer from "puppeteer";

/**
 * GenerateResumePDF
 * Takes a complete HTML string and returns a PDF buffer using Puppeteer.
 *
 * @param {string} html  - Full self-contained HTML of the resume
 * @returns {Promise<Buffer>} - PDF binary buffer
 */
export const GenerateResumePDF = async (html: string) => {
  let browser = null;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
        "--disable-accelerated-2d-canvas",
        "--no-first-run",
        "--no-zygote",
        "--disable-gpu",
      ],
    });

    const page = await browser.newPage();

    // Set viewport to A4 proportions at 96dpi
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 2 });

    // Load HTML — networkidle0 waits for Google Fonts to finish loading
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000,
    });

    // Extra wait to ensure fonts render correctly before PDF capture
    await new Promise((resolve) => setTimeout(resolve, 500));

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: {
        top: "0px",
        right: "0px",
        bottom: "0px",
        left: "0px",
      },
    });

    return pdfBuffer;
  } finally {
    // Always close the browser even if an error is thrown
    if (browser) {
      await browser.close();
    }
  }
};
