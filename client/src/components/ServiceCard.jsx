import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { iconMap } from '../utils/data';

export default function ServiceCard({ service }) {
  const Icon = iconMap[service.icon] || iconMap.Wrench;
  return (
    <Link to={`/booking?service=${service._id}`} className="card group block p-5 transition hover:-translate-y-1 hover:border-brand">
      <div className="flex items-start justify-between gap-4">
        <span className="grid h-12 w-12 place-items-center rounded-lg bg-teal-50 text-brand dark:bg-teal-950"><Icon /></span>
        <ArrowRight className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-brand" />
      </div>
      <h3 className="mt-5 text-lg font-black dark:text-white">{service.name}</h3>
      <p className="mt-2 min-h-12 text-sm leading-6 text-slate-500">{service.description}</p>
      <p className="mt-4 text-sm font-bold text-ink dark:text-white">Starts at Rs. {service.basePrice}</p>
    </Link>
  );
}

