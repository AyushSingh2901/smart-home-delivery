import { BadgeCheck, BellRing, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ProviderCard({ provider }) {
  return (
    <article className="card p-5">
      <div className="flex items-start gap-4">
        <div className="grid h-14 w-14 shrink-0 place-items-center rounded-lg bg-slate-100 text-xl font-black text-brand dark:bg-slate-800">
          {provider.user?.name?.charAt(0) || 'P'}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-black dark:text-white">{provider.user?.name}</h3>
            {provider.verified && <BadgeCheck size={18} className="text-brand" />}
          </div>
          <p className="mt-1 text-sm text-slate-500">{provider.headline}</p>
        </div>
      </div>
      <div className="mt-5 flex flex-wrap gap-2">
        {provider.skills?.slice(0, 3).map((skill) => <span key={skill} className="rounded-lg bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600 dark:bg-slate-800 dark:text-slate-300">{skill}</span>)}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 text-sm">
        <span className="flex items-center gap-1 font-bold dark:text-white"><Star size={16} className="fill-saffron text-saffron" />{provider.rating?.average}</span>
        <span className="flex items-center gap-1 text-slate-500"><MapPin size={16} />Nearby</span>
        <span className="flex items-center gap-1 text-coral">{provider.emergencyAvailable && <BellRing size={16} />}Urgent</span>
      </div>
      <Link to={`/providers/${provider._id}`} className="btn-secondary mt-5 w-full py-2.5">View Details</Link>
    </article>
  );
}

