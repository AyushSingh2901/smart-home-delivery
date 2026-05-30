import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 text-center">
        <div>
          <p className="text-7xl font-black text-brand">404</p>
          <h1 className="mt-4 text-3xl font-black dark:text-white">Page not found</h1>
          <p className="mt-3 text-slate-500">The page you requested does not exist.</p>
          <Link to="/" className="btn-primary mt-8">Go home</Link>
        </div>
      </main>
    </div>
  );
}

