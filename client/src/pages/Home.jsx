import { ArrowRight, BellRing, CalendarCheck, MapPin, ShieldCheck, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ProviderCard from '../components/ProviderCard';
import ServiceCard from '../components/ServiceCard';
import StatCard from '../components/StatCard';
import { endpoints } from '../services/api';
import { dashboardStats } from '../utils/data';

export default function Home() {
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);

  useEffect(() => {
    endpoints.services().then(({ data }) => setServices(data.services)).catch(() => setServices([]));
    endpoints.providers().then(({ data }) => setProviders(data.providers)).catch(() => setProviders([]));
  }, []);

  return (
    <div className="bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <section className="relative overflow-hidden bg-white dark:bg-slate-950">
        <div className="mx-auto grid min-h-[82vh] max-w-7xl items-center gap-10 px-4 py-12 lg:grid-cols-[1fr_0.9fr]">
          <div>
            <span className="inline-flex items-center gap-2 rounded-lg bg-teal-50 px-3 py-2 text-sm font-bold text-brand dark:bg-teal-950"><ShieldCheck size={18} /> Verified local home experts</span>
            <h1 className="mt-6 max-w-3xl text-5xl font-black leading-tight text-ink dark:text-white md:text-7xl">Smart Home Service Booking Platform</h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">Book plumbers, electricians, carpenters, AC repair workers, cleaners and painters with real-time status, chat, map tracking and secure payments.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/services" className="btn-primary"><CalendarCheck size={20} />Book a Service</Link>
              <Link to="/booking?urgent=true" className="btn-secondary"><BellRing size={20} />Need service urgently</Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {dashboardStats.map((stat) => <StatCard key={stat.label} {...stat} />)}
            </div>
          </div>
          <div className="relative">
            <div className="card animate-float p-5">
              <div className="aspect-[4/3] rounded-lg bg-[url('https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center" />
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {['Live tracking', 'Verified pros', 'MongoDB data'].map((item) => <span key={item} className="rounded-lg bg-slate-100 px-3 py-2 text-center text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-200">{item}</span>)}
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-7xl px-4 py-16">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black dark:text-white">Popular services</h2>
            <p className="mt-2 text-slate-500">Clean cards, transparent pricing and quick booking.</p>
          </div>
          <Link to="/services" className="btn-secondary py-2.5">View all <ArrowRight size={18} /></Link>
        </div>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {services.length ? services.slice(0, 6).map((service) => <ServiceCard key={service._id} service={service} />) : <div className="sm:col-span-2 lg:col-span-3"><EmptyState title="No services in MongoDB" message="Run npm run seed or create services from the admin API." /></div>}
        </div>
      </section>
      <section className="bg-white py-16 dark:bg-slate-900">
        <div className="mx-auto max-w-7xl px-4">
          <h2 className="text-3xl font-black dark:text-white">Nearby professionals</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {providers.length ? providers.slice(0, 4).map((provider) => <ProviderCard key={provider._id} provider={provider} />) : <EmptyState title="No providers in MongoDB" message="Register as a provider or seed the database to see nearby professionals." />}
          </div>
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-4 py-16 md:grid-cols-3">
        {['Fast and professional. The live status updates made the whole repair stress-free.', 'Provider arrived on time and the payment flow was smooth.', 'Admin dashboard gives the clarity needed to run operations at city scale.'].map((quote, index) => (
          <blockquote key={quote} className="card p-6">
            <div className="flex gap-1 text-saffron">{Array.from({ length: 5 }).map((_, item) => <Star key={item} size={18} className="fill-current" />)}</div>
            <p className="mt-5 leading-7 text-slate-600 dark:text-slate-300">{quote}</p>
            <footer className="mt-5 font-bold dark:text-white">Customer {index + 1}</footer>
          </blockquote>
        ))}
      </section>
      <Footer />
    </div>
  );
}
