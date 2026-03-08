import { PDFParse } from "pdf-parse";

export const GetPDFText = async (buffer: Buffer): Promise<string> => {
  const text = await new PDFParse(Uint8Array.from(buffer)).getText();
  return text.text;
};
