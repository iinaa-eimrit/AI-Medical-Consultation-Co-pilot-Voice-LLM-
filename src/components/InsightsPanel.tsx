import type { ReactNode } from 'react';
import { useConsultationStore } from '../store/useConsultationStore';
import { Stethoscope, Pill, CalendarClock, ListChecks, FileText } from 'lucide-react';

export default function InsightsPanel() {
  const insights = useConsultationStore((s) => s.insights);

  if (!insights) {
    return (
      <aside className="w-96 bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex flex-col items-center justify-center text-center text-gray-400">
        <Stethoscope className="w-12 h-12 mb-3" />
        <p className="text-sm">Extracted insights will appear here after analysis.</p>
      </aside>
    );
  }

  return (
    <aside className="w-96 bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-y-auto">
      <h2 className="font-medium mb-4">Consultation Insights</h2>
      <div className="space-y-4">
        <InsightCard
          icon={<Stethoscope className="w-5 h-5 text-blue-500" />}
          title="Symptoms"
          items={insights.symptoms}
        />
        <InsightCard
          icon={<Pill className="w-5 h-5 text-green-500" />}
          title="Medications"
          items={insights.medications}
        />
        <InsightCard
          icon={<CalendarClock className="w-5 h-5 text-purple-500" />}
          title="Follow-up Date"
          items={insights.followUpDate ? [insights.followUpDate] : []}
        />
        <InsightCard
          icon={<ListChecks className="w-5 h-5 text-orange-500" />}
          title="Action Items"
          items={insights.actionItems}
        />
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
            <FileText className="w-4 h-4" />
            Summary
          </div>
          <p className="text-sm text-gray-600">{insights.summary}</p>
        </div>
      </div>
    </aside>
  );
}

function InsightCard({
  icon,
  title,
  items,
}: {
  icon: ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <div>
      <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
        {icon}
        {title}
      </div>
      {items.length > 0 ? (
        <ul className="space-y-1">
          {items.map((item, idx) => (
            <li key={idx} className="text-sm text-gray-600 pl-7">{item}</li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-gray-400 pl-7">None noted</p>
      )}
    </div>
  );
}
