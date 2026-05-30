export default function Loader({ label = 'Loading' }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-semibold text-slate-500">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-brand border-t-transparent" />
      {label}
    </div>
  );
}

