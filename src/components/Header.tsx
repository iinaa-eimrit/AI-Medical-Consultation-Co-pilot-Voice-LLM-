import { Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <h1 className="text-xl font-semibold">New Consultation</h1>
      <button className="p-2 rounded-full hover:bg-gray-100">
        <Bell className="w-5 h-5 text-gray-500" />
      </button>
    </header>
  );
}
