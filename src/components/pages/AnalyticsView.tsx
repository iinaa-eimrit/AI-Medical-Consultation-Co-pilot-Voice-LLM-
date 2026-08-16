import { BarChart3, TrendingUp, Clock, AlertTriangle, ChevronDown } from 'lucide-react';

export default function AnalyticsView() {
  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slateNavy">Clinical Analytics</h1>
          <p className="text-slate-500 mt-1">Overview of AI consultation metrics and clinical trends</p>
        </div>
        <button className="bg-white border border-gray-300 text-slate-700 px-4 py-2 rounded-lg font-medium flex items-center gap-2 shadow-sm">
          Last 30 Days <ChevronDown className="w-4 h-4" />
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Total Consultations</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg"><BarChart3 className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-slateNavy">1,284</span>
            <span className="flex items-center text-sm font-medium text-green-600 mb-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +12%
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Time Saved (AI)</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg"><Clock className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-slateNavy">142<span className="text-lg text-slate-500 font-medium ml-1">hrs</span></span>
            <span className="flex items-center text-sm font-medium text-green-600 mb-1">
              <TrendingUp className="w-3 h-3 mr-1" /> +5%
            </span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">AE Flags Detected</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg"><AlertTriangle className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-slateNavy">27</span>
            <span className="text-sm font-medium text-slate-400 mb-1">Needs review</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-2">
            <span className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Insight Accuracy</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg"><TrendingUp className="w-5 h-5" /></div>
          </div>
          <div className="flex items-end gap-3 mt-4">
            <span className="text-3xl font-bold text-slateNavy">98.4<span className="text-lg text-slate-500 font-medium ml-1">%</span></span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
        {/* Mock Chart 1 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-slateNavy mb-6">Top Extracted Diagnoses</h3>
          <div className="space-y-5">
            {[
              { label: 'Type 2 Diabetes Mellitus', val: 85, color: 'bg-teal-500' },
              { label: 'Essential Hypertension', val: 72, color: 'bg-blue-500' },
              { label: 'Non-Small Cell Lung Cancer', val: 45, color: 'bg-purple-500' },
              { label: 'Major Depressive Disorder', val: 30, color: 'bg-amber-500' },
              { label: 'Rheumatoid Arthritis', val: 20, color: 'bg-rose-500' },
            ].map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-slate-700">{item.label}</span>
                  <span className="text-slate-500 font-mono">{item.val} cases</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className={`h-full rounded-full ${item.color}`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mock Chart 2 */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-slateNavy mb-6">Consultation Volume (Last 7 Days)</h3>
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
          <div className="flex justify-between text-xs text-slate-400 font-medium mt-2 px-2">
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
            <span>Sun</span>
          </div>
        </div>
      </div>
    </div>
  );
}
