import TranscriptionPanel from './TranscriptionPanel';
import InsightsPanel from './InsightsPanel';

export default function ConsultationView() {
  return (
    <main className="flex-1 flex gap-4 p-4 overflow-hidden">
      <TranscriptionPanel />
      <InsightsPanel />
    </main>
  );
}
