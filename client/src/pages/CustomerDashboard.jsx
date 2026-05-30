import { CalendarCheck, CreditCard, MapPin, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DashboardShell from '../components/DashboardShell';
import EmptyState from '../components/EmptyState';
import MapPreview from '../components/MapPreview';
import StatCard from '../components/StatCard';
import { endpoints } from '../services/api';

export default function CustomerDashboard() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    endpoints.bookings().then(({ data }) => setBookings(data.bookings)).catch(() => {});
  }, []);

  return (
    <DashboardShell title="Customer Dashboard" subtitle="Track bookings, payments, provider location and history.">
      <div className="grid gap-5 md:grid-cols-3">
        <StatCard label="Active bookings" value={bookings.length} icon={CalendarCheck} />
        <StatCard label="Paid bookings" value={bookings.filter((booking) => booking.paymentStatus === 'Paid').length} icon={CreditCard} tone="saffron" />
        <StatCard label="Completed" value={bookings.filter((booking) => booking.status === 'Completed').length} icon={Star} tone="coral" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_420px]">
        <section className="card p-5">
          <h2 className="text-xl font-black dark:text-white">Booking history</h2>
          {bookings.length ? bookings.map((booking) => (
            <div key={booking._id} className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
              <div>
                <p className="font-black dark:text-white">{booking.service?.name}</p>
                <p className="mt-1 text-sm text-slate-500">{booking.status}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold dark:text-white">Rs. {booking.price}</span>
                <Link to={`/chat?booking=${booking._id}`} className="btn-secondary py-2">Chat</Link>
              </div>
            </div>
          )) : <EmptyState title="No bookings yet" message="Book a service to create a real MongoDB booking record." action={<Link to="/booking" className="btn-primary">Book a service</Link>} />}
        </section>
        <MapPreview title="Live provider tracking" />
      </div>
      <Link to="/booking?urgent=true" className="btn-primary mt-6"><MapPin size={18} />Need service urgently</Link>
    </DashboardShell>
  );
}
