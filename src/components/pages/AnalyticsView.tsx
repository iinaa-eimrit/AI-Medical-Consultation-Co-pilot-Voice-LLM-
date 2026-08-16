import { ClipboardList, TrendingUp, Timer, AlertOctagon, ChevronDown, Info, BadgeCheck } from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto w-full">
      <div className="flex justify-between items-start md:items-center mb-8 gap-4 flex-col md:flex-row">
        <div>
          <h1 className="text-2xl font-bold text-slateNavy">Clinical Analytics</h1>
          <p className="text-slate-500 mt-1">Overview of AI consultation metrics and clinical trends</p>
        </div>
        <button className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm hover:bg-slate-50 transition-colors shrink-0">
          Last 30 Days <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Consultations</span>
            <div className="p-2 bg-teal-50/70 text-teal-700 rounded-lg"><ClipboardList className="w-5 h-5" strokeWidth={2} /></div>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-3xl font-bold text-slateNavy leading-none mb-2.5">1,284</span>
            <span className="inline-flex w-max items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> ↑ 12%
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Time Saved (AI)</span>
            <div className="p-2 bg-teal-50/70 text-teal-700 rounded-lg"><Timer className="w-5 h-5" strokeWidth={2} /></div>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-3xl font-bold text-slateNavy leading-none mb-2.5">142<span className="text-lg text-slate-500 font-medium ml-1">hrs</span></span>
            <span className="inline-flex w-max items-center px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded">
              <TrendingUp className="w-3 h-3 mr-1" /> ↑ 5%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-amber-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-amber-400 transition-all cursor-pointer group">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider group-hover:text-amber-700 transition-colors">AE Flags Detected</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-100 transition-colors"><AlertOctagon className="w-5 h-5" strokeWidth={2} /></div>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-3xl font-bold text-slateNavy leading-none mb-2.5">27</span>
            <span className="inline-flex w-max items-center px-2.5 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-md ring-1 ring-amber-500/20">
              Needs triage workflow
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2 group relative">
            <div className="flex items-center gap-1.5 cursor-help">
              <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Insight Accuracy</span>
              <Info className="w-4 h-4 text-slate-400" />
              <div className="absolute top-full left-0 mt-2 w-64 p-2 bg-slate-800 text-white text-xs rounded shadow-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Based on human-in-the-loop verification of 500 recent consults
              </div>
            </div>
            <div className="p-2 bg-teal-50/70 text-teal-700 rounded-lg"><BadgeCheck className="w-5 h-5" strokeWidth={2} /></div>
          </div>
          <div className="flex flex-col mt-4">
            <span className="text-3xl font-bold text-slateNavy leading-none mb-2.5">98.4<span className="text-lg text-slate-500 font-medium ml-1">%</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Mock Chart 1 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-slateNavy mb-6">Top Extracted Diagnoses</h3>
          <div className="space-y-5">
            {[
              { label: 'Type 2 Diabetes Mellitus', val: 85, color: 'bg-teal-600', perc: '42%' },
              { label: 'Essential Hypertension', val: 72, color: 'bg-teal-500', perc: '36%' },
              { label: 'Non-Small Cell Lung Cancer', val: 45, color: 'bg-teal-400', perc: '22%' },
              { label: 'Major Depressive Disorder', val: 30, color: 'bg-teal-300', perc: '15%' },
              { label: 'Rheumatoid Arthritis', val: 20, color: 'bg-teal-200', perc: '10%' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500 font-mono">{item.val} cases <span className="text-slate-400">({item.perc})</span></span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Chart 2 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm flex flex-col">
          <h3 className="font-semibold text-slateNavy mb-6">Consultation Volume</h3>
          <div className="h-48 flex items-end justify-between gap-2 mt-auto border-b border-gray-100 pb-2">
            {[40, 65, 45, 80, 55, 30, 20].map((h, i) => (
              <div key={i} className="w-full flex flex-col items-center gap-2 group">
                <div className="w-full bg-teal-100 rounded-t-sm group-hover:bg-teal-500 transition-colors relative" style={{ height: `${h}%` }}>
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                    {h * 2}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between text-xs text-slate-400 font-medium mt-3 px-2">
            <span>Aug 12</span>
            <span>Aug 13</span>
            <span>Aug 14</span>
            <span>Aug 15</span>
            <span>Aug 16</span>
            <span>Aug 17</span>
            <span>Aug 18</span>
          </div>
        </div>
      </div>
    </div>
  );
}
