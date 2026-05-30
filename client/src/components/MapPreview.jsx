import { Navigation } from 'lucide-react';

export default function MapPreview({ title = 'Live provider tracking', coordinates = [77.209, 28.6139] }) {
  return (
    <div className="relative min-h-72 overflow-hidden rounded-lg border border-slate-200 bg-[#dff3ea] dark:border-slate-800 dark:bg-slate-900">
      <div className="absolute inset-0 opacity-70" style={{ backgroundImage: 'linear-gradient(#b8dfd1 1px, transparent 1px), linear-gradient(90deg, #b8dfd1 1px, transparent 1px)', backgroundSize: '34px 34px' }} />
      <div className="absolute left-1/2 top-1/2 grid h-16 w-16 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-brand text-white shadow-soft">
        <Navigation />
      </div>
      <div className="absolute bottom-4 left-4 right-4 rounded-lg bg-white/90 p-4 shadow-soft backdrop-blur dark:bg-slate-950/90">
        <p className="font-black dark:text-white">{title}</p>
        <p className="mt-1 text-sm text-slate-500">Google Maps-ready coordinates: {coordinates.join(', ')}</p>
      </div>
    </div>
  );
}

