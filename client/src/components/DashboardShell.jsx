import { CalendarCheck, LayoutDashboard, MessageCircle, Settings, WalletCards } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';

const items = [
  { label: 'Overview', icon: LayoutDashboard, to: '#' },
  { label: 'Bookings', icon: CalendarCheck, to: '/dashboard' },
  { label: 'Messages', icon: MessageCircle, to: '/chat' },
  { label: 'Payments', icon: WalletCards, to: '/payment-success' },
  { label: 'Settings', icon: Settings, to: '#' }
];

export default function DashboardShell({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[240px_1fr]">
        <aside className="card h-max p-3">
          {items.map((item) => (
            <Link key={item.label} to={item.to} className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-bold text-slate-600 hover:bg-teal-50 hover:text-brand dark:text-slate-300 dark:hover:bg-teal-950">
              <item.icon size={18} />
              {item.label}
            </Link>
          ))}
        </aside>
        <main>
          <div className="mb-6">
            <h1 className="text-3xl font-black dark:text-white">{title}</h1>
            <p className="mt-2 text-slate-500">{subtitle}</p>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
}

