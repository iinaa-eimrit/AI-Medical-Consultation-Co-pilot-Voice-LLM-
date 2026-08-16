import { Search, UserPlus, FileHeart, Activity, AlertCircle } from 'lucide-react';

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
    <div className="flex flex-col h-full bg-slate-50 p-8 overflow-y-auto w-full">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slateNavy">Patient Directory</h1>
          <p className="text-slate-500 mt-1">Manage patient profiles and clinical histories</p>
        </div>
        <button className="bg-white border border-gray-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg font-medium flex items-center gap-2 shadow-sm transition-colors">
          <UserPlus className="w-5 h-5" />
          Add Patient
        </button>
      </div>

      <div className="relative mb-6">
        <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search by Patient Name, ID, or Diagnosis..." 
          className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500/50 focus:border-teal-500 text-lg"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockPatients.map((patient) => (
          <div key={patient.id} className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group cursor-pointer flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-teal-50 border border-teal-100 flex items-center justify-center text-teal-800 font-bold text-lg">
                  {patient.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-slateNavy text-lg leading-tight">{patient.name}</h3>
                  <p className="text-sm text-slate-500 font-mono mt-0.5">{patient.id} • {patient.age}{patient.sex}</p>
                </div>
              </div>
              <span className={`flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                patient.risk === 'High' ? 'bg-red-50 text-red-700 border border-red-100' :
                patient.risk === 'Medium' ? 'bg-amber-50 text-amber-700 border border-amber-100' :
                'bg-green-50 text-green-700 border border-green-100'
              }`}>
                {patient.risk === 'High' && <AlertCircle className="w-3 h-3" />}
                {patient.risk} Risk
              </span>
            </div>
            
            <div className="flex-1 space-y-3 mb-5">
              <div>
                <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block mb-1">Active Diagnoses</span>
                <div className="flex flex-wrap gap-1.5">
                  {patient.diagnoses.map(d => (
                    <span key={d} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded text-xs font-medium border border-slate-200">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-gray-100 flex justify-between items-center text-sm">
              <div className="text-slate-500 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-slate-400" />
                Last seen: {new Date(patient.lastVisit).toLocaleDateString()}
              </div>
              <button className="text-teal-700 font-medium group-hover:underline flex items-center gap-1">
                <FileHeart className="w-4 h-4" /> Chart
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
