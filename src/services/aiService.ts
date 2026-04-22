import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Initialize the Gemini API with environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

/**
 * Initialize the Gemini AI client
 * Call this before using any AI features
 */
export function initGemini(): boolean {
  if (!API_KEY) {
    console.warn('VITE_GEMINI_API_KEY not set. Gemini features will be disabled.');
    return false;
  }

  try {
    genAI = new GoogleGenerativeAI(API_KEY);
    model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    console.log('Gemini AI initialized successfully');
    return true;
  } catch (error) {
    console.error('Failed to initialize Gemini AI:', error);
    return false;
  }
}

/**
 * Check if Gemini is initialized and ready to use
 */
export function isGeminiReady(): boolean {
  return genAI !== null && model !== null;
}

/**
 * Generate content using Gemini
 * @param prompt - The text prompt to send to Gemini
 * @returns The generated text response
 */
export async function generateContent(prompt: string): Promise<string> {
  if (!isGeminiReady()) {
    if (!initGemini()) {
      throw new Error('Gemini AI is not initialized. Please check your API key.');
    }
  }

  try {
    const result = await model!.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating content with Gemini:', error);
    throw new Error('Failed to generate content. Please try again.');
  }
}

/**
 * Generate structured content using Gemini with JSON output
 * @param prompt - The text prompt
 * @param schema - JSON schema for the expected output structure
 * @returns Parsed JSON object
 */
export async function generateStructuredContent<T>(
  prompt: string,
  schema: object
): Promise<T> {
  if (!isGeminiReady()) {
    if (!initGemini()) {
      throw new Error('Gemini AI is not initialized. Please check your API key.');
    }
  }

  try {
    const result = await model!.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const response = await result.response;
    const text = response.text();
    return JSON.parse(text) as T;
  } catch (error) {
    console.error('Error generating structured content:', error);
    throw new Error('Failed to generate structured content. Please try again.');
  }
}

/**
 * Stream content generation from Gemini
 * @param prompt - The text prompt
 * @param onChunk - Callback for each text chunk
 * @param onComplete - Callback when streaming is complete
 * @param onError - Callback for errors
 */
export async function streamContent(
  prompt: string,
  onChunk: (chunk: string) => void,
  onComplete: () => void,
  onError: (error: Error) => void
): Promise<void> {
  if (!isGeminiReady()) {
    if (!initGemini()) {
      onError(new Error('Gemini AI is not initialized. Please check your API key.'));
      return;
    }
  }

  try {
    const result = await model!.generateContentStream(prompt);

    for await (const chunk of result.stream) {
      const text = chunk.text();
      if (text) {
        onChunk(text);
      }
    }

    onComplete();
  } catch (error) {
    console.error('Error streaming content:', error);
    onError(error instanceof Error ? error : new Error('Streaming failed'));
  }
}

export default {
  initGemini,
  isGeminiReady,
  generateContent,
  generateStructuredContent,
  streamContent,
};
