import { Inbox } from 'lucide-react';

export default function EmptyState({ title = 'No records found', message = 'Once data is created in MongoDB, it will appear here.', action }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center dark:border-slate-700">
      <Inbox className="mx-auto text-slate-400" size={36} />
      <h3 className="mt-4 text-lg font-black dark:text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{message}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
