import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ConsultationView from './components/ConsultationView';

function App() {
  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <ConsultationView />
      </div>
    </div>
  );
}

export default App;
