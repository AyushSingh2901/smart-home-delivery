import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';

export default function Auth({ mode = 'login' }) {
  const [params] = useSearchParams();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: params.get('role') || 'customer',
    providerProfile: {
      headline: '',
      services: [],
      skillsText: '',
      emergencyAvailable: false,
      pricing: {}
    }
  });
  const { login, register } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) endpoints.services().then(({ data }) => setServices(data.services)).catch(() => setServices([]));
  }, [isLogin]);

  const updateProviderProfile = (patch) => {
    setForm((current) => ({
      ...current,
      providerProfile: { ...current.providerProfile, ...patch }
    }));
  };

  const toggleService = (serviceId) => {
    const exists = form.providerProfile.services.includes(serviceId);
    updateProviderProfile({
      services: exists
        ? form.providerProfile.services.filter((id) => id !== serviceId)
        : [...form.providerProfile.services, serviceId]
    });
  };

  const submit = async (event) => {
    event.preventDefault();
    if (!form.email || !form.password || (!isLogin && !form.name)) {
      toast.error('Please fill all required fields');
      return;
    }
    if (!isLogin && form.role === 'provider' && !form.providerProfile.services.length) {
      toast.error('Please select at least one service you provide');
      return;
    }
    try {
      const payload = isLogin
        ? form
        : {
            ...form,
            providerProfile: {
              ...form.providerProfile,
              skills: form.providerProfile.skillsText.split(',').map((skill) => skill.trim()).filter(Boolean)
            }
          };
      const user = isLogin ? await login(payload) : await register(payload);
      navigate(user.role === 'admin' ? '/admin' : user.role === 'provider' ? '/provider' : '/customer');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 py-12 lg:grid-cols-2">
        <section className="card p-8">
          <h1 className="text-3xl font-black dark:text-white">{isLogin ? 'Login' : 'Create account'}</h1>
          <p className="mt-2 text-slate-500">Create an account. Data is stored in MongoDB and loaded by role.</p>
          <form onSubmit={submit} className="mt-8 grid gap-4">
            {!isLogin && <input className="input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
            <input className="input" type="email" placeholder="Email address" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            {!isLogin && <input className="input" placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />}
            {!isLogin && (
              <select className="input" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                <option value="customer">Customer</option>
                <option value="provider">Service Provider</option>
                <option value="admin">Admin</option>
              </select>
            )}
            {!isLogin && form.role === 'provider' && (
              <div className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <h2 className="font-black dark:text-white">Services you provide</h2>
                <p className="mt-1 text-sm text-slate-500">Select real service categories loaded from MongoDB.</p>
                <input className="input mt-4" placeholder="Professional headline" value={form.providerProfile.headline} onChange={(e) => updateProviderProfile({ headline: e.target.value })} />
                <input className="input mt-3" placeholder="Skills, comma separated" value={form.providerProfile.skillsText} onChange={(e) => updateProviderProfile({ skillsText: e.target.value })} />
                {services.length ? (
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    {services.map((service) => (
                      <label key={service._id} className="rounded-lg border border-slate-200 p-3 text-sm font-bold dark:border-slate-800 dark:text-white">
                        <span className="flex items-start gap-2">
                          <input type="checkbox" checked={form.providerProfile.services.includes(service._id)} onChange={() => toggleService(service._id)} />
                          <span>
                            {service.name}
                            <span className="block text-xs font-normal text-slate-500">Base price Rs. {service.basePrice}</span>
                          </span>
                        </span>
                        {form.providerProfile.services.includes(service._id) && (
                          <input
                            className="input mt-3"
                            type="number"
                            min="0"
                            placeholder="Your price"
                            value={form.providerProfile.pricing[service._id] || ''}
                            onChange={(e) => updateProviderProfile({ pricing: { ...form.providerProfile.pricing, [service._id]: Number(e.target.value) } })}
                          />
                        )}
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="mt-4">
                    <EmptyState title="No services found" message="Ask an admin to create service categories, or run npm run seed once to bootstrap only the service catalog." />
                  </div>
                )}
                <label className="mt-4 flex items-center gap-3 text-sm font-bold dark:text-white">
                  <input type="checkbox" checked={form.providerProfile.emergencyAvailable} onChange={(e) => updateProviderProfile({ emergencyAvailable: e.target.checked })} />
                  I accept urgent/emergency bookings
                </label>
              </div>
            )}
            <button className="btn-primary">{isLogin ? 'Login' : 'Register'}</button>
          </form>
          <button className="mt-5 font-bold text-brand" onClick={() => setIsLogin((current) => !current)}>
            {isLogin ? 'Need an account?' : 'Already registered?'}
          </button>
        </section>
        <section className="card p-8">
          <h2 className="text-2xl font-black dark:text-white">Real account flow</h2>
          <p className="mt-3 leading-7 text-slate-500">Register as a customer, service provider, or admin. Users are stored in MongoDB, providers save selected service categories, and bookings appear only after a customer creates them.</p>
          <div className="mt-6 rounded-lg bg-teal-50 p-4 text-sm font-semibold text-brand dark:bg-teal-950">Run `npm run seed` only once if your service catalog is empty. It no longer creates sample users or bookings.</div>
          <Link to="/" className="btn-secondary mt-6">Back home</Link>
        </section>
      </main>
    </div>
  );
}
