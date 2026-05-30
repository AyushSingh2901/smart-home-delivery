import { Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ServiceCard from '../components/ServiceCard';
import { endpoints } from '../services/api';

export default function Services() {
  const [services, setServices] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => {
    endpoints.services().then(({ data }) => setServices(data.services)).catch(() => setServices([]));
  }, []);

  const filtered = useMemo(() => services.filter((service) => `${service.name} ${service.category}`.toLowerCase().includes(query.toLowerCase())), [services, query]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12">
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <h1 className="text-4xl font-black dark:text-white">Service Listing</h1>
            <p className="mt-2 text-slate-500">Search by category and book verified nearby providers.</p>
          </div>
          <label className="relative block max-w-md flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input className="input pl-11" placeholder="Search plumber, electrician, cleaning..." value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.length ? filtered.map((service) => <ServiceCard key={service._id} service={service} />) : <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="No services found" message="Services are loaded only from MongoDB. Seed or create services to show them here." /></div>}
        </div>
      </main>
      <Footer />
    </div>
  );
}
