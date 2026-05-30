export default function StatCard({ label, value, icon: Icon, tone = 'brand' }) {
  const toneClass = tone === 'coral' ? 'bg-red-50 text-coral dark:bg-red-950' : tone === 'saffron' ? 'bg-amber-50 text-saffron dark:bg-amber-950' : 'bg-teal-50 text-brand dark:bg-teal-950';
  return (
    <div className="card p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-black dark:text-white">{value}</p>
        </div>
        {Icon && <span className={`grid h-12 w-12 place-items-center rounded-lg ${toneClass}`}><Icon /></span>}
      </div>
    </div>
  );
}

