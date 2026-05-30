import { CheckCircle2, Download, Home } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function PaymentSuccess() {
  const [params] = useSearchParams();
  const booking = params.get('booking');

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid min-h-[70vh] max-w-3xl place-items-center px-4 py-12">
        <section className="card w-full p-8 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-brand" />
          <h1 className="mt-6 text-3xl font-black dark:text-white">Payment Success</h1>
          <p className="mt-3 text-slate-500">Your booking is confirmed and the booking record is stored in MongoDB.</p>
          {booking && <p className="mt-5 rounded-lg bg-slate-100 p-3 font-mono text-sm dark:bg-slate-800 dark:text-white">Booking ID: {booking}</p>}
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link to="/customer" className="btn-primary"><Home size={18} />Go to dashboard</Link>
            <button className="btn-secondary"><Download size={18} />Invoice</button>
          </div>
        </section>
      </main>
    </div>
  );
}
