import { LayoutDashboard, Users, FileText, Settings, Activity } from 'lucide-react';
import { useConsultationStore } from '../store/useConsultationStore';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileText, label: 'Consultations' },
  { icon: Users, label: 'Patients' },
  { icon: Activity, label: 'Analytics' },
  { icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const activeTab = useConsultationStore((s) => s.activeTab);
  const setActiveTab = useConsultationStore((s) => s.setActiveTab);

  return (
    <aside className="w-60 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center px-6 border-b border-gray-200">
        <span className="text-lg font-bold text-deepTeal tracking-tight">Clinical Workspace</span>
      </div>
      <nav className="flex-1 py-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => setActiveTab(item.label)}
            className={`w-full flex items-center gap-3 px-6 py-2.5 text-sm font-medium ${
              activeTab === item.label
                ? 'bg-teal-50 text-deepTeal'
                : 'text-slate-500 hover:bg-slate-50 hover:text-slateNavy'
            }`}
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
