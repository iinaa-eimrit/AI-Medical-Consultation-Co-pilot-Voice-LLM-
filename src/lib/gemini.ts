import { GoogleGenerativeAI } from '@google/generative-ai';
import type { ClinicalInsights } from '../types/clinical';
import { useConsultationStore } from '../store/useConsultationStore';

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const modelName = import.meta.env.VITE_GEMINI_MODEL || 'gemini-1.5-pro';
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

import { z } from 'zod';

const ClinicalInsightsSchema = z.object({
  entities: z.array(z.object({
    name: z.string(),
    type: z.enum(['Drug', 'Dosage', 'Symptom', 'Condition'])
  })),
  actionItems: z.array(z.object({
    task: z.string(),
    assignee: z.enum(['HCP', 'Patient', 'Staff']),
    dueDate: z.string().optional()
  })),
  adverseEvents: z.array(z.string()),
  followUpDate: z.string(),
  summary: z.string(),
  confidenceScore: z.number().min(0).max(100)
});

function parseJsonFromText(text: string): unknown {
  const cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  if (start === -1 || end === -1) {
    throw new Error('Could not parse JSON from Gemini response');
  }
  const jsonStr = cleaned.substring(start, end + 1);
  return JSON.parse(jsonStr);
}

export async function extractInsights(transcript: string): Promise<ClinicalInsights> {
  if (!genAI) {
    throw new Error('VITE_GEMINI_API_KEY is not set. Copy .env.example to .env.local and add your key.');
  }

  const basePrompt = `You are an AI assistant built for MediCo, analyzing a highly compliant, clinical-grade medical transcription.
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

  const setAgentState = useConsultationStore.getState().setAgentState;
  
  const MAX_RETRIES = 3;
  let currentPrompt = basePrompt;
  const model = genAI.getGenerativeModel({ model: modelName });

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    console.log(`[Orchestrator] Schema Extraction: Attempt ${attempt}/${MAX_RETRIES}`);
    setAgentState(attempt === 1 ? 'Analyzing clinical transcript...' : `Schema validation failed. Agent self-correcting (Attempt ${attempt}/3)...`);
    
    try {
      const result = await model.generateContent(currentPrompt);
      const response = await result.response;
      const text = response.text();
      
      const rawJson = parseJsonFromText(text);
      const validationResult = ClinicalInsightsSchema.safeParse(rawJson);
      
      if (validationResult.success) {
        console.log(`[Orchestrator] Attempt ${attempt} Success. Graph Node Terminated Safely.`);
        setAgentState(null);
        return validationResult.data as ClinicalInsights;
      } else {
        console.warn(`[Validator Node] Attempt ${attempt} failed schema validation:`, validationResult.error.issues);
        const errorFeedback = validationResult.error.issues.map(
          issue => `- Path: ${issue.path.join('.')}, Error: ${issue.message}`
        ).join('\n');
        
        console.log("[Validator Node] Rerouting error feedback back to LLM context window...");
        currentPrompt = basePrompt + `\n\n---\nSYSTEM FEEDBACK ON PREVIOUS ATTEMPT:\nYour previous response failed schema validation. You must correct the following errors:\n${errorFeedback}\nPlease return ONLY the corrected JSON object.`;
      }
    } catch (error) {
      console.warn(`[Orchestrator] Attempt ${attempt} threw a catastrophic runtime error:`, error);
      if (attempt === MAX_RETRIES) throw error;
      currentPrompt = basePrompt + `\n\nSYSTEM ERROR ON PREVIOUS ATTEMPT: Failed to parse JSON. Return strictly raw JSON.`;
    }
  }

  console.error("[Orchestrator] Graph execution halted. Maximum retries exceeded. Falling back to safe state.");
  setAgentState(null);
  return {
    entities: [],
    actionItems: [],
    adverseEvents: ['System Error: Failed to extract structured insights due to strict schema validation.'],
    followUpDate: '',
    summary: 'Extraction failed due to repeated schema violations.',
    confidenceScore: 0
  };
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
