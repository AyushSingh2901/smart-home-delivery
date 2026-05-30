import { BadgeDollarSign, CalendarCheck, CheckCircle2, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { endpoints } from '../services/api';

export default function ProviderDashboard() {
  const [bookings, setBookings] = useState([]);
  const { provider } = useAuth();

  const load = () => endpoints.bookings().then(({ data }) => setBookings(data.bookings)).catch(() => {});
  useEffect(() => { load(); }, []);

  const update = async (id, status) => {
    try {
      await endpoints.updateBooking(id, status);
      toast.success(`Booking ${status}`);
      load();
    } catch {
      toast.error('Could not update booking');
    }
  };

  return (
    <DashboardShell title="Provider Dashboard" subtitle="Manage availability, booking requests, earnings and ratings.">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Earnings" value={`Rs. ${Number(provider?.earnings || 0).toLocaleString()}`} icon={BadgeDollarSign} />
        <StatCard label="Jobs" value={provider?.totalJobs || bookings.length} icon={CalendarCheck} tone="saffron" />
        <StatCard label="Rating" value={provider?.rating?.average || 0} icon={Star} tone="coral" />
        <StatCard label="Verified" value={provider?.verified ? 'Yes' : 'No'} icon={CheckCircle2} />
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-xl font-black dark:text-white">Booking requests</h2>
        {bookings.length ? bookings.map((booking) => (
          <div key={booking._id} className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="font-black dark:text-white">{booking.service?.name}</p>
                <p className="text-sm text-slate-500">{booking.customer?.name} - {booking.status}</p>
              </div>
              <p className="font-bold dark:text-white">Rs. {booking.price}</p>
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {['Accepted', 'Rejected', 'In Progress', 'Completed'].map((status) => <button key={status} onClick={() => update(booking._id, status)} className="btn-secondary py-2 text-sm">{status}</button>)}
              <Link to={`/chat?booking=${booking._id}`} className="btn-primary py-2 text-sm">Chat</Link>
            </div>
          </div>
        )) : <EmptyState title="No provider bookings" message="Accepted provider bookings stored in MongoDB will appear here." />}
      </section>
    </DashboardShell>
  );
}
