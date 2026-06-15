# Medical Consultation Copilot

A simple dashboard for doctors to capture a consultation and get a structured summary using Gemini.

## What it does
- Records speech in the browser (Web Speech API, works best in Chrome).
- Shows a live transcript.
- Sends the transcript to Gemini and extracts symptoms, medications, follow-up date, action items, and a short summary.

## Setup
1. Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).
2. Copy `.env.example` to `.env.local` and fill in your key.
3. Run `npm install` and `npm run dev`.

## Notes
- Speech recognition requires Chrome or Edge. If it doesn't work, check browser permissions.
- The API key stays in your browser for this demo. Don't deploy this to production without a backend proxy.
- Default model is `gemini-1.5-pro`. You can change it in `.env.local` by setting `VITE_GEMINI_MODEL`.
