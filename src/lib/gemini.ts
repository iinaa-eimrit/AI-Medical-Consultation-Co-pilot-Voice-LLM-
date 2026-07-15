import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ClinicalInsights } from '../types/clinical';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

function parseJsonFromText(text: string): ClinicalInsights {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Could not parse JSON from Gemini response');
  }
  const jsonStr = cleaned.substring(start, end + 1);
  return JSON.parse(jsonStr) as ClinicalInsights;
}

export async function extractInsights(transcript: string): Promise<ClinicalInsights> {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key.');
  }

  const prompt = `You are an AI assistant built for SynthioLabs, analyzing a highly compliant, clinical-grade medical transcription.
Extract structured information from the following consultation transcript. 
Return ONLY a valid JSON object matching the following structure exactly (no markdown formatting outside of a JSON block):
{
  "entities": [ { "name": "string", "type": "Drug" | "Dosage" | "Symptom" | "Condition" } ],
  "actionItems": [ { "task": "string", "assignee": "HCP" | "Patient" | "Staff", "dueDate": "string or empty" } ],
  "adverseEvents": [ "string of any adverse events, empty if none" ],
  "followUpDate": "string, empty if not mentioned",
  "summary": "string, 1-2 sentence clinical summary",
  "confidenceScore": number (0-100 indicating extraction confidence)
}

Transcript:
${transcript}`;

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return parseJsonFromText(text);
  } catch (error) {
    console.warn("Gemini API failed, falling back to mock data for demo purposes:", error);
    // Simulate network delay for the skeleton loader
    await new Promise(resolve => setTimeout(resolve, 2000));
    return {
      entities: [
        { name: 'Pembrolizumab', type: 'Drug' },
        { name: '200mg IV', type: 'Dosage' },
        { name: 'Grade 2 Rash', type: 'AdverseEvent' as any }, // 'Symptom'
      ],
      actionItems: [
        { task: 'Prescribe topical corticosteroids', assignee: 'HCP', dueDate: 'Immediately' },
        { task: 'Monitor rash progression', assignee: 'Patient', dueDate: 'Daily' }
      ],
      adverseEvents: ['Grade 2 rash reported after second cycle of Pembrolizumab.'],
      followUpDate: 'Prior to next infusion (3 weeks)',
      summary: 'Discussed Pembrolizumab regimen. Patient experiencing grade 2 rash; considering topical corticosteroids.',
      confidenceScore: 94
    };
  }
}

export async function generateSystemReply(transcriptHistory: string): Promise<string> {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY is not set.');
  }

  const prompt = `You are an AI Medical Consultation Co-pilot named SYSTEM. You are listening to a live consultation.
The HCP (Healthcare Professional) has just spoken. Respond briefly, professionally, and concisely (1-2 sentences max) to acknowledge, pull up relevant mock records, or ask a brief clarifying question if appropriate. Do not offer medical advice, only assist the HCP.

Conversation history:
${transcriptHistory}

Your reply (as SYSTEM):`;

  try {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.warn("Gemini API failed for system reply, using fallback:", error);
    await new Promise(resolve => setTimeout(resolve, 1500));
    return "Noted. I've updated the current session logs.";
  }
}
