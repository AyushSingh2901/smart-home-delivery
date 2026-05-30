import { BriefcaseBusiness, Home, LogOut, Menu, Moon, Sun, UserRound, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const navItems = [
  { label: 'Home', to: '/' },
  { label: 'Services', to: '/services' },
  { label: 'Become a Partner', to: '/register?role=provider' },
  { label: 'My Bookings', to: '/dashboard' }
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-ink dark:text-white">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand text-white"><Home size={20} /></span>
          SmartServe
        </Link>
        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `rounded-lg px-4 py-2 text-sm font-semibold transition ${isActive ? 'bg-teal-50 text-brand dark:bg-teal-950' : 'text-slate-600 hover:text-brand dark:text-slate-300'}`}>
              {item.label}
            </NavLink>
          ))}
        </div>
        <div className="hidden items-center gap-2 lg:flex">
          <button aria-label="Toggle theme" onClick={toggleTheme} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800 dark:text-white">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {user ? (
            <>
              <Link to={`/${user.role}`} className="btn-secondary py-2.5"><UserRound size={18} />{user.name}</Link>
              <button onClick={logout} className="btn-primary py-2.5"><LogOut size={18} />Logout</button>
            </>
          ) : (
            <Link to="/login" className="btn-primary py-2.5"><BriefcaseBusiness size={18} />Login/Register</Link>
          )}
        </div>
        <button aria-label="Open menu" onClick={() => setOpen((current) => !current)} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800 dark:text-white lg:hidden">
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 dark:border-slate-800 dark:bg-slate-950 lg:hidden">
          <div className="flex flex-col gap-2">
            {navItems.map((item) => <Link key={item.to} onClick={() => setOpen(false)} to={item.to} className="rounded-lg px-3 py-3 font-semibold text-slate-700 dark:text-slate-200">{item.label}</Link>)}
            <Link onClick={() => setOpen(false)} to="/login" className="btn-primary">Login/Register</Link>
          </div>
        </div>
      )}
    </header>
  );
}

