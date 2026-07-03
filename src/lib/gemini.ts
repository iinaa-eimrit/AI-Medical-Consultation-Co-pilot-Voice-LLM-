import { GoogleGenerativeAI } from '@google/generative-ai';
import type { Insights } from '../store/useConsultationStore';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function parseJsonFromText(text: string): Insights {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Could not parse JSON from Gemini response');
  }
  const jsonStr = cleaned.substring(start, end + 1);
  return JSON.parse(jsonStr) as Insights;
}

export async function extractInsights(transcript: string): Promise<Insights> {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key.');
  }

  const prompt = `You are an assistant for a doctor. Extract structured information from the following consultation transcript. Return only JSON with keys: symptoms (array of strings), medications (array of strings), followUpDate (string, empty if not mentioned), actionItems (array of strings), summary (string, 1-2 sentences). Transcript:\n\n${transcript}`;

  const model = genAI.getGenerativeModel({ model: modelName });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return parseJsonFromText(text);
}
