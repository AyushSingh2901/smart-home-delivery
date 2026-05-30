import { BellRing, CalendarDays, CreditCard } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import MapPreview from '../components/MapPreview';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';

export default function Booking() {
  const [params] = useSearchParams();
  const [services, setServices] = useState([]);
  const [providers, setProviders] = useState([]);
  const [form, setForm] = useState({
    service: params.get('service') || '',
    provider: params.get('provider') || '',
    scheduledFor: '',
    line1: '',
    city: '',
    urgent: params.get('urgent') === 'true',
    notes: ''
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    endpoints.services().then(({ data }) => {
      setServices(data.services);
      if (!form.service && data.services[0]?._id) setForm((current) => ({ ...current, service: data.services[0]._id }));
    }).catch(() => setServices([]));
  }, []);

  useEffect(() => {
    if (!form.service) return;
    endpoints.providers({ service: form.service, urgent: form.urgent }).then(({ data }) => setProviders(data.providers)).catch(() => {});
  }, [form.service, form.urgent]);

  const selectedService = useMemo(() => services.find((service) => service._id === form.service) || services[0], [services, form.service]);

  const submit = async (event) => {
    event.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!form.service || !form.scheduledFor || !form.line1) {
      toast.error('Please select date/time and address');
      return;
    }
    try {
      const { data } = await endpoints.createBooking({
        service: form.service,
        provider: form.provider || undefined,
        scheduledFor: form.scheduledFor,
        urgent: form.urgent,
        notes: form.notes,
        address: { line1: form.line1, city: form.city }
      });
      toast.success('Booking created');
      navigate(`/payment-success?booking=${data.booking._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Booking failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1fr_420px]">
        <section className="card p-6">
          <h1 className="text-3xl font-black dark:text-white">Booking Flow</h1>
          <p className="mt-2 text-slate-500">Choose service, provider, preferred date/time, urgency and address.</p>
          {!services.length ? <div className="mt-8"><EmptyState title="No services available" message="Booking uses services from MongoDB only. Run npm run seed or create a service first." /></div> : <form onSubmit={submit} className="mt-8 grid gap-4">
            <select className="input" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })}>{services.map((service) => <option key={service._id} value={service._id}>{service.name}</option>)}</select>
            <select className="input" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })}>
              <option value="">AI recommended best available provider</option>
              {providers.map((provider) => <option key={provider._id} value={provider._id}>{provider.user?.name} - {provider.rating?.average} stars</option>)}
            </select>
            <input className="input" type="datetime-local" value={form.scheduledFor} onChange={(e) => setForm({ ...form, scheduledFor: e.target.value })} />
            <input className="input" placeholder="Address line" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
            <input className="input" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
            <textarea className="input min-h-28" placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
            <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-4 font-bold dark:border-slate-800 dark:text-white">
              <input type="checkbox" checked={form.urgent} onChange={(e) => setForm({ ...form, urgent: e.target.checked })} />
              <BellRing className="text-coral" size={18} /> Need service urgently
            </label>
            <button className="btn-primary"><CreditCard size={18} />Confirm booking</button>
          </form>}
        </section>
        <aside className="space-y-5">
          <div className="card p-6">
            <CalendarDays className="text-brand" />
            <h2 className="mt-4 text-xl font-black dark:text-white">{selectedService?.name}</h2>
            <p className="mt-2 text-slate-500">{selectedService?.description}</p>
            <p className="mt-5 text-2xl font-black dark:text-white">Rs. {(selectedService?.basePrice || 0) + (form.urgent ? 299 : 0)}</p>
          </div>
          <MapPreview />
        </aside>
      </main>
    </div>
  );
}
