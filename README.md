# MediCo - Clinical AI Copilot

![MediCo Banner](public/medico_logo.png)

**MediCo Copilot** is an enterprise-grade, highly secure AI medical transcription and patient management dashboard. Designed with a strict "owner mindset," it replaces "magic AI" cliches with a pixel-perfect, clinical, and data-dense user interface.

## 🚀 Key Features

- **Live Medical Transcription**: Real-time voice-to-text processing utilizing the native Web Speech API (Chrome/Edge optimized).
- **Clinical AI Extraction**: Integrates seamlessly with **Google Gemini 1.5 Pro** to intelligently parse raw transcripts into structured medical entities:
  - Active Diagnoses & Condition tracking
  - Prescribed Medications & Dosages
  - Adverse Events & Risk Stratification Flags
  - Automated Action Items
- **Enterprise-Grade UI**: Built on a highly customized, accessible foundation using **Tailwind CSS v4** and **Shadcn UI**. The interface strictly adheres to clean data-ink ratios and semantic iconography (Lucide React) to guarantee clinical trust.
- **Robust State Management**: Utilizes **Zustand** for seamless, globally synced patient and consultation state across the entire dashboard.

## 🛠️ Technology Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + Vanilla CSS Modules
- **UI Primitives**: Shadcn UI + Radix UI
- **Icons**: Lucide React
- **State Management**: Zustand
- **AI Processing**: Google Gemini AI (NLP & Entity Extraction)

## 💻 Local Setup & Installation

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/iinaa-eimrit/AI-Medical-Consultation-Co-pilot-Voice-LLM-.git
   cd AI-Medical-Consultation-Co-pilot-Voice-LLM-
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Obtain a Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey).
   - Copy the `.env.example` file to a new file named `.env.local`.
   - Add your API key to `.env.local`:
     ```env
     VITE_GEMINI_API_KEY=your_actual_api_key_here
     ```

4. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will launch on `http://localhost:5173`.*

## 🔒 Security Notes
- For demonstration purposes, this prototype calls the Gemini API directly from the client. **Do not deploy this architecture to a production environment** without implementing a secure backend proxy to protect your API keys.
- Voice transcription utilizes the browser's native engine. Ensure microphone permissions are explicitly granted.

## 📐 Design Philosophy
- **No "Magic Wands"**: Clinical data requires trust. We utilize deterministic, universally understood semantic icons instead of AI sparkles.
- **Horizontal Scaling**: Patient cards and consultation tables are built with robust flexbox/grid constraints, ensuring layout integrity regardless of varying medical data string lengths.

---
*Developed as a technical showcase for modern, healthcare-oriented UI/UX engineering.*
