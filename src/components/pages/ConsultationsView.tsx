import { FileText, Search, Filter, Plus } from 'lucide-react';
import { useConsultationStore } from '../../store/useConsultationStore';

const mockConsultations = [
  { id: 'CON-8832', date: '2026-08-16T09:30:00', patient: 'JD (Male, 54)', provider: 'Dr. Sarah Chen', status: 'AI Processing', condition: 'Oncology follow-up' },
  { id: 'CON-8831', date: '2026-08-15T14:15:00', patient: 'MK (Female, 62)', provider: 'Dr. Sarah Chen', status: 'Completed', condition: 'Hypertension management' },
  { id: 'CON-8829', date: '2026-08-14T11:00:00', patient: 'RT (Male, 41)', provider: 'Dr. James Wilson', status: 'Completed', condition: 'Type 2 Diabetes' },
  { id: 'CON-8828', date: '2026-08-14T09:45:00', patient: 'AL (Female, 28)', provider: 'Dr. Sarah Chen', status: 'Needs Addendum', condition: 'Asthma exacerbation' },
];

export default function ConsultationsView() {
  const setActiveTab = useConsultationStore((s) => s.setActiveTab);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto w-full scrollbar-hide">
      <div className="bg-white border border-gray-200 rounded-2xl shadow-md overflow-hidden flex-1 flex flex-col">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4 bg-slate-50/50 flex-wrap">
          <div className="flex items-center gap-3 flex-1 min-w-[300px]">
            <div className="relative flex-1 max-w-md h-10">
              <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Patient ID, Provider, or Keyword..." 
                className="w-full h-full pl-10 pr-16 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 transition-shadow text-sm"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 border border-gray-200 bg-gray-50 rounded px-1.5 py-0.5 shadow-sm">
                <span className="text-[10px] font-medium text-slate-400">⌘K</span>
              </div>
            </div>
            <button className="h-10 px-4 py-2 border border-gray-300 rounded-lg text-slate-700 text-sm font-medium flex items-center justify-center gap-2 hover:bg-slate-50 bg-white shrink-0">
              <Filter className="w-4 h-4" />
              Filters
            </button>
          </div>
          <button 
            onClick={() => setActiveTab('Dashboard')}
            className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 h-10 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            Start New
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-hide w-full">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-sm text-slate-500 font-medium tracking-wide">
                <th className="px-6 py-4 whitespace-nowrap">ID</th>
                <th className="px-6 py-4 whitespace-nowrap">Date & Time</th>
                <th className="px-6 py-4 whitespace-nowrap">Patient</th>
                <th className="px-6 py-4 whitespace-nowrap">Provider</th>
                <th className="px-6 py-4 whitespace-nowrap">Condition Focus</th>
                <th className="px-6 py-4 whitespace-nowrap">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockConsultations.map((con) => (
                <tr 
                  key={con.id} 
                  className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                  onClick={() => setActiveTab('Dashboard')}
                >
                  <td className="px-6 py-5 whitespace-nowrap font-mono text-sm text-slate-700">{con.id}</td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                    <div className="font-mono text-xs">
                      {new Date(con.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm font-medium text-slateNavy">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center text-[10px] font-bold border-2 border-white shadow-sm ring-1 ring-black/5 shrink-0">
                        {con.patient.substring(0, 2)}
                      </div>
                      <span>{con.patient}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">
                    <div>
                      {con.provider}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-sm text-slate-600">{con.condition}</td>
                  <td className="px-6 py-5">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5 w-max ${
                      con.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-600/20' :
                      con.status === 'AI Processing' ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-600/20' :
                      'bg-rose-50 text-rose-700 ring-1 ring-rose-600/20'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        con.status === 'Completed' ? 'bg-emerald-500' :
                        con.status === 'AI Processing' ? 'bg-amber-500 animate-pulse' :
                        'bg-rose-500'
                      }`}></span>
                      {con.status}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="text-slate-400 group-hover:text-teal-700 font-medium text-sm flex items-center gap-1 justify-end w-full transition-colors">
                      <FileText className="w-4 h-4" /> View
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
