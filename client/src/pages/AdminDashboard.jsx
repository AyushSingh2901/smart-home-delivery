import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { ShieldCheck, Users, WalletCards, Wrench } from 'lucide-react';
import { useEffect, useState } from 'react';
import DashboardShell from '../components/DashboardShell';
import EmptyState from '../components/EmptyState';
import StatCard from '../components/StatCard';
import { endpoints } from '../services/api';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState({ users: 0, providers: 0, bookings: 0, revenue: 0, bookingTrends: [], popularServices: [] });
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [providers, setProviders] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    endpoints.analytics().then(({ data }) => setAnalytics(data.analytics)).catch(() => {});
    endpoints.bookings().then(({ data }) => setBookings(data.bookings)).catch(() => setBookings([]));
    endpoints.users().then(({ data }) => setUsers(data.users)).catch(() => setUsers([]));
    endpoints.adminProviders().then(({ data }) => setProviders(data.providers)).catch(() => setProviders([]));
    endpoints.adminPayments().then(({ data }) => setPayments(data.payments)).catch(() => setPayments([]));
  }, []);

  return (
    <DashboardShell title="Admin Dashboard" subtitle="Manage users, providers, bookings, payments, reports and platform analytics.">
      <div className="grid gap-5 md:grid-cols-4">
        <StatCard label="Users" value={analytics.users} icon={Users} />
        <StatCard label="Providers" value={analytics.providers} icon={ShieldCheck} tone="saffron" />
        <StatCard label="Bookings" value={analytics.bookings} icon={Wrench} />
        <StatCard label="Revenue" value={`Rs. ${Number(analytics.revenue).toLocaleString()}`} icon={WalletCards} tone="coral" />
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="text-xl font-black dark:text-white">Booking trends</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.bookingTrends}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="status" /><YAxis /><Tooltip /><Bar dataKey="count" fill="#0f9f8f" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-black dark:text-white">Popular services</h2>
          <div className="mt-5 h-72">
            <ResponsiveContainer width="100%" height="100%"><BarChart data={analytics.popularServices}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="bookings" fill="#ff6b57" radius={[6, 6, 0, 0]} /></BarChart></ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-xl font-black dark:text-white">All bookings</h2>
        <div className="mt-4 overflow-x-auto">
          {bookings.length ? (
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="text-slate-500">
                <tr><th className="p-3">Service</th><th className="p-3">Customer</th><th className="p-3">Provider</th><th className="p-3">Status</th><th className="p-3">Payment</th><th className="p-3">Amount</th></tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id} className="border-t border-slate-200 dark:border-slate-800">
                    <td className="p-3 font-bold dark:text-white">{booking.service?.name || 'N/A'}</td>
                    <td className="p-3 text-slate-500">{booking.customer?.name || 'N/A'}</td>
                    <td className="p-3 text-slate-500">{booking.provider?.user?.name || 'Unassigned'}</td>
                    <td className="p-3 text-slate-500">{booking.status}</td>
                    <td className="p-3 text-slate-500">{booking.paymentStatus}</td>
                    <td className="p-3 font-bold dark:text-white">Rs. {booking.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <EmptyState title="No bookings in MongoDB" message="Customer bookings will appear here as soon as they are created." />}
        </div>
      </section>
      <div className="mt-6 grid gap-6 lg:grid-cols-3">
        <section className="card p-5">
          <h2 className="text-xl font-black dark:text-white">Users</h2>
          <div className="mt-4 space-y-3">
            {users.length ? users.slice(0, 6).map((user) => <div key={user._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><p className="font-bold dark:text-white">{user.name}</p><p className="text-sm text-slate-500">{user.email} - {user.role}</p></div>) : <EmptyState title="No users" />}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-black dark:text-white">Providers</h2>
          <div className="mt-4 space-y-3">
            {providers.length ? providers.slice(0, 6).map((provider) => <div key={provider._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><p className="font-bold dark:text-white">{provider.user?.name}</p><p className="text-sm text-slate-500">{provider.verified ? 'Verified' : 'Pending verification'} - {provider.services?.length || 0} services</p></div>) : <EmptyState title="No providers" />}
          </div>
        </section>
        <section className="card p-5">
          <h2 className="text-xl font-black dark:text-white">Payments</h2>
          <div className="mt-4 space-y-3">
            {payments.length ? payments.slice(0, 6).map((payment) => <div key={payment._id} className="rounded-lg border border-slate-200 p-3 dark:border-slate-800"><p className="font-bold dark:text-white">Rs. {payment.amount}</p><p className="text-sm text-slate-500">{payment.customer?.name || 'N/A'} - {payment.status}</p></div>) : <EmptyState title="No payments" />}
          </div>
        </section>
      </div>
      <section className="card mt-6 p-5">
        <h2 className="text-xl font-black dark:text-white">Moderation center</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-slate-200 p-4 font-bold dark:border-slate-800 dark:text-white">Pending providers: {providers.filter((provider) => !provider.verified).length}</div>
          <div className="rounded-lg border border-slate-200 p-4 font-bold dark:border-slate-800 dark:text-white">Inactive users: {users.filter((user) => !user.isActive).length}</div>
          <div className="rounded-lg border border-slate-200 p-4 font-bold dark:border-slate-800 dark:text-white">Failed payments: {payments.filter((payment) => payment.status === 'failed').length}</div>
        </div>
      </section>
    </DashboardShell>
  );
}
