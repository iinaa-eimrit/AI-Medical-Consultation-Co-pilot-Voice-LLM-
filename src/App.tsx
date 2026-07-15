import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConsultationView from './components/ConsultationView';
import { useConsultationStore } from './store/useConsultationStore';
import { Clock } from 'lucide-react';

function PlaceholderView({ title }: { title: string }) {
  return (
    <main className="flex-1 w-full flex flex-col items-center justify-center p-6 bg-slate-50">
      <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-gray-200 shadow-sm max-w-md text-center">
        <Clock className="w-12 h-12 text-slate-300 mb-4" />
        <h2 className="text-xl font-semibold text-slateNavy mb-2">{title} Module</h2>
        <p className="text-sm text-slate-500">This module is currently in development and will be available in a future release.</p>
      </div>
    </main>
  );
}

function App() {
  const activeTab = useConsultationStore((s) => s.activeTab);

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {activeTab === 'Dashboard' ? <ConsultationView /> : <PlaceholderView title={activeTab} />}
      </div>
    </div>
  );
}

export default App;
