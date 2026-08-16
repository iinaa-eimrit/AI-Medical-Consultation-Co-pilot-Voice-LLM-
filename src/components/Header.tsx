import { Bell, Menu } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { useConsultationStore } from '../store/useConsultationStore';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const activeTab = useConsultationStore(s => s.activeTab);
  const isMobileMenuOpen = useConsultationStore(s => s.isMobileMenuOpen);
  const setIsMobileMenuOpen = useConsultationStore(s => s.setIsMobileMenuOpen);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getHeaderTitle = () => {
    switch (activeTab) {
      case 'Consultations': return 'Consultation Records';
      case 'Patients': return 'Patient Directory';
      case 'Analytics': return 'Analytics Overview';
      default: return 'Active Consultation';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-6 relative z-50">
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 -ml-2 rounded-lg text-slate-500 hover:bg-slate-100 md:hidden"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-semibold text-slateNavy">{getHeaderTitle()}</h1>
      </div>
      
      <div className="relative" ref={dropdownRef}>
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-full hover:bg-slate-100 relative transition-colors" 
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white animate-pulse"></span>
        </button>

        {isOpen && (
          <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col transform origin-top-right transition-all">
            <div className="px-4 py-3 border-b border-gray-100 bg-slate-50 flex justify-between items-center">
              <span className="font-semibold text-slateNavy">Clinical Alerts</span>
              <span className="text-xs text-teal-700 font-medium cursor-pointer hover:underline">Mark all as read</span>
            </div>
            <div className="max-h-80 overflow-y-auto">
              <div className="px-4 py-3 border-b border-gray-50 hover:bg-slate-50 cursor-pointer transition-colors bg-blue-50/30">
                <p className="text-sm font-semibold text-slate-800">Critical Lab Alert: Patient JD</p>
                <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">Potassium levels elevated (5.4 mEq/L). Action required before next oncology cycle.</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">10 mins ago</p>
              </div>
              <div className="px-4 py-3 border-b border-gray-50 hover:bg-slate-50 cursor-pointer transition-colors">
                <p className="text-sm font-medium text-slate-800">Consultation Summary Ready</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">AI has finished extracting insights and action items for MK.</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">2 hours ago</p>
              </div>
              <div className="px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors">
                <p className="text-sm font-medium text-slate-800">System Update</p>
                <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">Gemini 3.5 Flash model successfully deployed to your environment.</p>
                <p className="text-[10px] text-slate-400 mt-1 font-mono">1 day ago</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
