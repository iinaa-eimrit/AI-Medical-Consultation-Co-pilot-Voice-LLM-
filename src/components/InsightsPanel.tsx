import { useConsultationStore } from '../store/useConsultationStore';
import { Stethoscope, Pill, CalendarClock, ListChecks, FileText, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useState } from 'react';

export default function InsightsPanel() {
  const insights = useConsultationStore((s) => s.insights);
  const isAnalyzing = useConsultationStore((s) => s.isAnalyzing);
  const { displayedText: summaryText, isTyping } = useTypewriter(insights?.summary || null, 15);
  
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set());

  const toggleCheck = (idx: number) => {
    const newSet = new Set(checkedItems);
    if (newSet.has(idx)) {
      newSet.delete(idx);
    } else {
      newSet.add(idx);
    }
    setCheckedItems(newSet);
  };

  if (isAnalyzing) {
    return (
      <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm p-4 overflow-hidden">
        <div className="animate-pulse space-y-6">
          <div className="h-6 bg-slate-200 rounded w-1/2"></div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-4 bg-slate-100 rounded w-5/6"></div>
            <div className="h-4 bg-slate-100 rounded w-4/6"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-20 bg-slate-100 rounded w-full"></div>
          </div>
          <div className="space-y-3">
            <div className="h-4 bg-slate-100 rounded w-full"></div>
            <div className="h-10 bg-slate-100 rounded w-full"></div>
          </div>
        </div>
      </aside>
    );
  }

  if (!insights) {
    return (
      <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10 shrink-0">
          <h2 className="font-semibold text-slateNavy">Clinical Insights</h2>
        </div>
        <div className="flex-1 bg-slate-50 border-t border-dashed border-slate-200 p-4 flex flex-col items-center justify-center text-center text-slate-400">
          <Stethoscope className="w-12 h-12 mb-3 text-slate-300" />
          <h3 className="font-medium text-slateNavy mb-1">No Data Extracted</h3>
          <p className="text-sm">Click "Extract Clinical Insights" to generate structured data.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-y-auto scrollbar-hide">
      <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10 shrink-0">
        <h2 className="font-semibold text-slateNavy">Clinical Insights</h2>
        <div className="group relative flex items-center gap-1 bg-teal-50 text-deepTeal px-2 py-1 rounded-md text-xs font-bold cursor-help">
          <CheckCircle2 className="w-3 h-3" />
          {insights.confidenceScore}% Conf
          <div className="absolute right-0 top-full mt-1 w-48 p-2 bg-slateNavy text-white text-[10px] rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20 shadow-lg">
            AI Confidence Level based on context clarity and clinical terminology mapping.
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {insights.adverseEvents && insights.adverseEvents.length > 0 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-2">
              <AlertTriangle className="w-4 h-4" />
              Adverse Events Detected
            </div>
            <ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
              {insights.adverseEvents.map((ae, idx) => (
                <li key={idx}>{ae}</li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slateNavy mb-3">
            <Pill className="w-4 h-4 text-deepTeal" />
            Extracted Entities
          </div>
          {insights.entities && insights.entities.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {insights.entities.map((entity, idx) => (
                <div key={idx} className="flex flex-col border border-slate-200 rounded-md px-2 py-1 bg-slate-50">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{entity.type}</span>
                  <span className="text-sm font-medium text-slateNavy">{entity.name}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400 italic">No clinical entities found.</p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-slateNavy mb-3">
            <ListChecks className="w-4 h-4 text-mutedIndigo" />
            Action Items
          </div>
          {insights.actionItems && insights.actionItems.length > 0 ? (
            <ul className="space-y-2">
              {insights.actionItems.map((action, idx) => {
                const isChecked = checkedItems.has(idx);
                return (
                  <li key={idx} className={`flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-white shadow-sm transition-all ${isChecked ? 'opacity-60' : ''}`}>
                    <input 
                      type="checkbox" 
                      className="mt-1 rounded text-deepTeal focus:ring-deepTeal border-slate-300 cursor-pointer" 
                      checked={isChecked}
                      onChange={() => toggleCheck(idx)}
                    />
                    <div className="flex-1">
                      <p className={`text-sm font-medium transition-all ${isChecked ? 'text-slate-400 line-through' : 'text-slateNavy'}`}>
                        {action.task}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${isChecked ? 'bg-slate-50 text-slate-400' : 'bg-slate-100 text-slate-500'}`}>
                          Assignee: {action.assignee}
                        </span>
                        {action.dueDate && (
                          <span className={`text-[10px] flex items-center gap-1 ${isChecked ? 'text-slate-400' : 'text-slate-500'}`}>
                            <CalendarClock className="w-3 h-3" />
                            {action.dueDate}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="text-sm text-slate-400 italic">No action items.</p>
          )}
        </div>

        <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
          <div className="flex items-center gap-2 text-sm font-semibold text-slateNavy mb-2">
            <FileText className="w-4 h-4 text-slate-500" />
            Clinical Summary
          </div>
          <p className="text-sm text-slate-600 leading-relaxed min-h-[4rem]">
            {summaryText}
            {isTyping && <span className="ml-0.5 inline-block w-1.5 h-4 bg-slate-400 animate-pulse align-middle"></span>}
          </p>
        </div>

        {insights.followUpDate && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
            <CalendarClock className="w-4 h-4 text-slate-400" />
            <span className="font-semibold text-slateNavy">Follow-up:</span> {insights.followUpDate}
          </div>
        )}
      </div>
    </aside>
  );
}
