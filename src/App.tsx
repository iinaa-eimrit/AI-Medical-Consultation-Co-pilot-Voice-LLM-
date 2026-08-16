import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConsultationView from './components/ConsultationView';
import ConsultationsView from './components/pages/ConsultationsView';
import PatientsView from './components/pages/PatientsView';
import AnalyticsView from './components/pages/AnalyticsView';
import { useConsultationStore } from './store/useConsultationStore';


function App() {
  const activeTab = useConsultationStore((s) => s.activeTab);

  const renderContent = () => {
    switch (activeTab) {
      case 'Dashboard':
        return <ConsultationView />;
      case 'Consultations':
        return <ConsultationsView />;
      case 'Patients':
        return <PatientsView />;
      case 'Analytics':
        return <AnalyticsView />;
      default:
        return <ConsultationView />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        {renderContent()}
      </div>
    </div>
  );
}

export default App;
