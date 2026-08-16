import { Search, UserPlus, FileHeart, Calendar, AlertCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

const mockPatients = [
  { id: 'PT-99421', name: 'James D. (JD)', age: 54, sex: 'M', lastVisit: '2026-08-16', diagnoses: ['Non-Small Cell Lung Cancer'], risk: 'High' },
  { id: 'PT-88312', name: 'Maria K. (MK)', age: 62, sex: 'F', lastVisit: '2026-08-15', diagnoses: ['Hypertension', 'Osteoarthritis'], risk: 'Low' },
  { id: 'PT-77294', name: 'Robert T. (RT)', age: 41, sex: 'M', lastVisit: '2026-08-14', diagnoses: ['Type 2 Diabetes', 'Obesity'], risk: 'Medium' },
  { id: 'PT-66183', name: 'Anna L. (AL)', age: 28, sex: 'F', lastVisit: '2026-08-14', diagnoses: ['Severe Asthma'], risk: 'Medium' },
  { id: 'PT-55920', name: 'David W. (DW)', age: 71, sex: 'M', lastVisit: '2026-08-10', diagnoses: ['Coronary Artery Disease'], risk: 'High' },
  { id: 'PT-44811', name: 'Sarah M. (SM)', age: 35, sex: 'F', lastVisit: '2026-08-05', diagnoses: ['Migraine with Aura'], risk: 'Low' },
];

export default function PatientsView() {
  return (
    <div className="flex flex-col h-full bg-slate-50 p-4 md:p-8 overflow-y-auto w-full scrollbar-hide">
      <div className="flex flex-col gap-3 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 shadow-sm hover:shadow-md transition-shadow">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-teal-600" />
            <input 
              type="text" 
              placeholder="Ask AI to find patients (e.g., 'High risk diabetics under 50')..." 
              className="w-full pl-12 pr-16 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-base transition-shadow"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 border border-gray-200 bg-gray-100 rounded px-2 py-1 shadow-sm">
              <span className="text-xs font-mono text-gray-500">⌘K</span>
            </div>
          </div>
          <button className="bg-white border border-gray-300 hover:bg-slate-50 text-slate-700 h-[58px] px-6 rounded-xl font-medium flex items-center justify-center gap-2 shadow-sm transition-colors shrink-0">
            <UserPlus className="w-5 h-5 text-slate-500" />
            <span className="hidden sm:inline">Add Patient</span>
          </button>
        </div>
        
        {/* Active AI Filters */}
        <div className="flex items-center gap-2 px-1">
          <span className="text-xs text-slate-500 font-medium mr-1">Active AI Filters:</span>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 text-slate-600 px-2.5 py-1 rounded-full text-xs shadow-sm hover:bg-slate-50 cursor-pointer transition-colors">
            <span className="font-semibold text-slate-700">Risk:</span> High
            <span className="ml-1 text-slate-400 hover:text-slate-600">✕</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white border border-gray-200 text-slate-600 px-2.5 py-1 rounded-full text-xs shadow-sm hover:bg-slate-50 cursor-pointer transition-colors">
            <span className="font-semibold text-slate-700">Condition:</span> Diabetes
            <span className="ml-1 text-slate-400 hover:text-slate-600">✕</span>
          </div>
          <button className="text-xs text-teal-600 hover:text-teal-700 font-medium ml-2">Clear all</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockPatients.map((patient) => (
          <div key={patient.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm relative transition-all duration-200 hover:shadow-md hover:border-teal-500/30 hover:-translate-y-0.5 cursor-pointer flex flex-col group">
            <div className="flex items-start justify-between gap-2 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm shrink-0">
                    {patient.name.includes('(') ? patient.name.split('(')[1].substring(0, 2) : patient.name.substring(0, 2)}
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 leading-tight truncate">
                      {patient.name.split(' (')[0]}
                      {patient.name.includes('(') && (
                        <span className="text-gray-400 font-normal text-xs ml-1">({patient.name.split('(')[1]}</span>
                      )}
                    </h3>
                    <p className="text-xs text-gray-500 truncate">{patient.id} • {patient.age}{patient.sex}</p>
                  </div>
                </div>
              </div>
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shrink-0 whitespace-nowrap border shadow-sm ${
                patient.risk === 'High' ? 'bg-red-50 text-red-700 border-red-200' :
                patient.risk === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {patient.risk === 'High' && <AlertTriangle className="w-3.5 h-3.5 shrink-0" />}
                {patient.risk === 'Medium' && <AlertCircle className="w-3.5 h-3.5 shrink-0" />}
                {patient.risk === 'Low' && <ShieldCheck className="w-3.5 h-3.5 shrink-0" />}
                {patient.risk} Risk
              </span>
            </div>
            
            <div className="flex-1 space-y-3 mb-5">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider block mb-2">Active Diagnoses</span>
                <div className="flex flex-wrap gap-1.5 min-h-[48px] content-start">
                  {patient.diagnoses.map(d => (
                    <span key={d} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-slate-500">
              <div className="flex items-center gap-1.5 shrink-0 min-w-0 pr-2">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">Last seen: {new Date(patient.lastVisit).toLocaleDateString()}</span>
              </div>
              <button className="text-teal-700 font-medium hover:bg-teal-50 px-2 py-1.5 rounded flex items-center gap-1 shrink-0 transition-colors">
                <FileHeart className="w-3.5 h-3.5 shrink-0" /> View Record
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
