import TranscriptionPanel from './TranscriptionPanel';
import InsightsPanel from './InsightsPanel';

export default function ConsultationView() {
  return (
    <main className="flex-1 w-full grid grid-cols-2 gap-6 p-6 overflow-hidden">
      <TranscriptionPanel />
      <InsightsPanel />
    </main>
  );
}
