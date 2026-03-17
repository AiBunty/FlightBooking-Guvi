export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-4 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Copyright {new Date().getFullYear()} SkyLedger Flights.</p>
        <p>Secure booking infrastructure for modern travel teams.</p>
      </div>
    </footer>
  );
}
