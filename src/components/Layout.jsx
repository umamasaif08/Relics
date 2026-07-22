import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="min-h-screen bg-relic-paper text-relic-ink dark:bg-relic-ink dark:text-relic-paper">
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <footer className="border-t border-black/5 px-4 py-8 text-center text-sm text-neutral-500 dark:border-white/10">
        Data provided by the{' '}
        <a
          href="https://www.metmuseum.org/about-the-met/policies-and-documents/open-access"
          target="_blank"
          rel="noreferrer"
          className="underline decoration-relic-gold/50 underline-offset-4"
        >
          Met Museum Open Access API
        </a>
      </footer>
    </div>
  );
}
