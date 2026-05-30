import { BadgeCheck, CalendarCheck, MessageCircle, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import MapPreview from '../components/MapPreview';
import Navbar from '../components/Navbar';
import ProviderCard from '../components/ProviderCard';
import { endpoints } from '../services/api';

export default function ProviderDetails() {
  const { id } = useParams();
  const [provider, setProvider] = useState(null);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    endpoints.providers().then(({ data }) => {
      const found = data.providers.find((item) => item._id === id);
      if (found) setProvider(found);
    }).catch(() => setProvider(null));
    endpoints.reviews(id).then(({ data }) => setReviews(data.reviews)).catch(() => {});
  }, [id]);

  if (!provider) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Navbar />
        <main className="mx-auto max-w-3xl px-4 py-12">
          <EmptyState title="Provider not found" message="Provider details are loaded from MongoDB only." />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Navbar />
      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-12 lg:grid-cols-[1fr_420px]">
        <section className="space-y-6">
          <div className="card p-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h1 className="flex items-center gap-2 text-3xl font-black dark:text-white">{provider.user?.name}{provider.verified && <BadgeCheck className="text-brand" />}</h1>
                <p className="mt-2 text-slate-500">{provider.headline}</p>
              </div>
              <span className="flex items-center gap-1 rounded-lg bg-amber-50 px-3 py-2 font-bold text-saffron dark:bg-amber-950"><Star className="fill-current" size={18} />{provider.rating?.average}</span>
            </div>
            <p className="mt-6 leading-7 text-slate-600 dark:text-slate-300">{provider.bio || 'Verified local professional with transparent pricing, real-time updates and reliable field experience.'}</p>
            <div className="mt-6 flex flex-wrap gap-2">{provider.skills?.map((skill) => <span key={skill} className="rounded-lg bg-slate-100 px-3 py-2 text-sm font-bold dark:bg-slate-800 dark:text-white">{skill}</span>)}</div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to={`/booking?provider=${provider._id}`} className="btn-primary"><CalendarCheck size={18} />Book provider</Link>
              <Link to="/chat" className="btn-secondary"><MessageCircle size={18} />Chat</Link>
            </div>
          </div>
          <div className="card p-6">
            <h2 className="text-xl font-black dark:text-white">Ratings and reviews</h2>
            {reviews.length ? reviews.map((review) => (
              <div key={review._id} className="mt-4 rounded-lg border border-slate-200 p-4 dark:border-slate-800">
                <p className="font-bold text-saffron">{review.rating} stars</p>
                <p className="mt-2 text-slate-500">{review.comment}</p>
              </div>
            )) : <EmptyState title="No reviews yet" message="Customer reviews from MongoDB will appear here after completed bookings." />}
          </div>
        </section>
        <aside className="space-y-5">
          <ProviderCard provider={provider} />
          <MapPreview title="Provider live location" coordinates={provider.location?.coordinates || [77.209, 28.6139]} />
        </aside>
      </main>
    </div>
  );
}
