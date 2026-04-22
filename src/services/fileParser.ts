import mammoth from 'mammoth';

// Configure pdfjs worker (Vite-friendly URL import)
import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore - Vite handles ?url for worker
import pdfWorker from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

(pdfjsLib as any).GlobalWorkerOptions.workerSrc = pdfWorker;

export interface ExtractedFile {
  fileName: string;
  text: string;
  charCount: number;
}

/**
 * Extract plain text from a File (PDF, DOCX, TXT, MD).
 * Throws on unsupported types or empty extraction.
 */
export async function extractTextFromFile(file: File): Promise<ExtractedFile> {
  const name = file.name.toLowerCase();
  let text = '';

  if (name.endsWith('.txt') || name.endsWith('.md') || file.type.startsWith('text/')) {
    text = await file.text();
  } else if (name.endsWith('.docx')) {
    const buffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer: buffer });
    text = result.value || '';
  } else if (name.endsWith('.pdf')) {
    const buffer = await file.arrayBuffer();
    const pdf = await (pdfjsLib as any).getDocument({ data: buffer }).promise;
    const parts: string[] = [];
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      parts.push(content.items.map((it: any) => it.str).join(' '));
    }
    text = parts.join('\n\n');
  } else if (name.endsWith('.doc')) {
    throw new Error('Legacy .doc files are not supported. Please save as .docx and try again.');
  } else {
    throw new Error(`Unsupported file type: ${file.name}`);
  }

  text = text.replace(/\s+\n/g, '\n').replace(/\n{3,}/g, '\n\n').trim();

  if (!text || text.length < 10) {
    throw new Error(`Could not extract readable text from "${file.name}". The file may be empty or image-based.`);
  }

  return { fileName: file.name, text, charCount: text.length };
}

export async function extractTextFromFiles(files: File[]): Promise<string> {
  const results = await Promise.all(files.map(extractTextFromFile));
  return results
    .map((r) => `--- FILE: ${r.fileName} ---\n${r.text}`)
    .join('\n\n');
}