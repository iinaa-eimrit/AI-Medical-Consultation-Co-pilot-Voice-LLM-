import { FileText, Calendar, User, Search, Filter, Plus } from 'lucide-react';
import { useConsultationStore } from '../../store/useConsultationStore';

const mockConsultations = [
  { id: 'CON-8832', date: '2026-08-16T09:30:00', patient: 'JD (Male, 54)', provider: 'Dr. Sarah Chen', status: 'Pending Review', condition: 'Oncology follow-up' },
  { id: 'CON-8831', date: '2026-08-15T14:15:00', patient: 'MK (Female, 62)', provider: 'Dr. Sarah Chen', status: 'Completed', condition: 'Hypertension management' },
  { id: 'CON-8829', date: '2026-08-14T11:00:00', patient: 'RT (Male, 41)', provider: 'Dr. James Wilson', status: 'Completed', condition: 'Type 2 Diabetes' },
  { id: 'CON-8828', date: '2026-08-14T09:45:00', patient: 'AL (Female, 28)', provider: 'Dr. Sarah Chen', status: 'Needs Addendum', condition: 'Asthma exacerbation' },
];

export default function ConsultationsView() {
  const setActiveTab = useConsultationStore((s) => s.setActiveTab);

  return (
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slateNavy">Consultation Records</h1>
          <p className="text-slate-500 mt-1">Review and manage clinical AI transcriptions</p>
        </div>
        <button 
          onClick={() => setActiveTab('Dashboard')}
          className="bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-5 h-5" />
          Start New Consultation
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex-1 flex flex-col">
        <div className="p-4 border-b border-gray-100 flex gap-4 bg-slate-50/50">
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by Patient ID, Provider, or Keyword..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500"
            />
          </div>
          <button className="px-4 py-2 border border-gray-300 rounded-lg text-slate-700 font-medium flex items-center gap-2 hover:bg-slate-50">
            <Filter className="w-4 h-4" />
            Filters
          </button>
        </div>

        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-gray-200 text-sm text-slate-500 font-medium tracking-wide">
                <th className="px-6 py-4">ID</th>
                <th className="px-6 py-4">Date & Time</th>
                <th className="px-6 py-4">Patient</th>
                <th className="px-6 py-4">Provider</th>
                <th className="px-6 py-4">Condition Focus</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockConsultations.map((con) => (
                <tr key={con.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="px-6 py-4 font-mono text-sm text-slate-700">{con.id}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {new Date(con.date).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-slateNavy">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-teal-100 text-deepTeal flex items-center justify-center text-[10px] font-bold">
                        {con.patient.substring(0, 2)}
                      </div>
                      {con.patient}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      {con.provider}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{con.condition}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      con.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      con.status === 'Pending Review' ? 'bg-amber-100 text-amber-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {con.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-teal-700 hover:text-teal-900 font-medium text-sm opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 justify-end w-full">
                      <FileText className="w-4 h-4" /> View
                    </button>
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
