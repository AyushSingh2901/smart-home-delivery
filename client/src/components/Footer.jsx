export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-10 dark:border-slate-800 dark:bg-slate-950">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 md:grid-cols-4">
        <div className="md:col-span-2">
          <h3 className="text-xl font-black dark:text-white">SmartServe</h3>
          <p className="mt-3 max-w-md text-sm leading-6 text-slate-500">A production-ready MERN service marketplace for customers, local professionals, and admins.</p>
        </div>
        <div>
          <h4 className="font-bold dark:text-white">Company</h4>
          <p className="mt-3 text-sm text-slate-500">About</p>
          <p className="mt-2 text-sm text-slate-500">Contact</p>
        </div>
        <div>
          <h4 className="font-bold dark:text-white">Support</h4>
          <p className="mt-3 text-sm text-slate-500">Safety</p>
          <p className="mt-2 text-sm text-slate-500">Payments</p>
        </div>
      </div>
    </footer>
  );
}

