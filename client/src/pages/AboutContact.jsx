import { Mail, MapPin, Phone } from 'lucide-react';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

export default function AboutContact() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-2">
        <section>
          <h1 className="text-4xl font-black dark:text-white">About SmartServe</h1>
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">SmartServe connects households with verified nearby professionals while giving providers a full operations dashboard and admins city-level analytics, verification and payment records.</p>
          <div className="mt-8 grid gap-4">
            <p className="flex items-center gap-3 font-bold dark:text-white"><Mail className="text-brand" />support@smartserve.local</p>
            <p className="flex items-center gap-3 font-bold dark:text-white"><Phone className="text-brand" />+91 99999 90000</p>
            <p className="flex items-center gap-3 font-bold dark:text-white"><MapPin className="text-brand" />New Delhi, India</p>
          </div>
        </section>
        <form className="card grid gap-4 p-6">
          <h2 className="text-2xl font-black dark:text-white">Contact</h2>
          <input className="input" placeholder="Name" />
          <input className="input" placeholder="Email" />
          <textarea className="input min-h-36" placeholder="Message" />
          <button className="btn-primary" type="button">Send message</button>
        </form>
      </main>
      <Footer />
    </div>
  );
}

