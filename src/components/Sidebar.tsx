import { LayoutDashboard, Users, FileText, Activity, X } from 'lucide-react';
import { useConsultationStore } from '../store/useConsultationStore';
import { useEffect } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileText, label: 'Consultations' },
  { icon: Users, label: 'Patients' },
  { icon: Activity, label: 'Analytics' },
];

export default function Sidebar() {
  const activeTab = useConsultationStore((s) => s.activeTab);
  const setActiveTab = useConsultationStore((s) => s.setActiveTab);

  const isMobileMenuOpen = useConsultationStore((s) => s.isMobileMenuOpen);
  const setIsMobileMenuOpen = useConsultationStore((s) => s.setIsMobileMenuOpen);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsMobileMenuOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [setIsMobileMenuOpen]);

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 md:hidden transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0
        ${isMobileMenuOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
          <span className="text-xl font-black text-deepTeal tracking-tight">Synthio<span className="text-teal-600 font-semibold">Scribe</span></span>
          <button 
            className="md:hidden p-1 text-slate-400 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
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
    </>
  );
}
