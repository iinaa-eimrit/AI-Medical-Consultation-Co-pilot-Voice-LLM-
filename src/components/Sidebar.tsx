import { LayoutDashboard, Users, FileText, BarChart2, X } from 'lucide-react';
import { useConsultationStore } from '../store/useConsultationStore';
import { useEffect } from 'react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard' },
  { icon: FileText, label: 'Consultations' },
  { icon: Users, label: 'Patients' },
  { icon: BarChart2, label: 'Analytics' },
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
        <div className="flex items-center gap-2.5 px-6 h-16 border-b border-gray-200 shrink-0">
          <img src="/medico_logo.png" alt="MediCo Logo" className="h-7 w-auto object-contain shrink-0" />
          <span className="text-2xl tracking-tight flex items-center">
            <span className="font-extrabold text-slate-800">Medi</span>
            <span className="font-extrabold text-teal-600">Co</span>
          </span>
          <button 
            className="md:hidden p-1 ml-auto text-slate-400 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.label;
            return (
              <button
                key={item.label}
                onClick={() => setActiveTab(item.label)}
                className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-all border-l-4 ${
                  isActive 
                    ? 'bg-teal-50/50 text-teal-700 border-teal-600' 
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700 border-transparent'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'stroke-[2.5]' : 'stroke-[1.5]'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
