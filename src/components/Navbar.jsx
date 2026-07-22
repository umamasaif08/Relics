import { NavLink } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navLinkClass = ({ isActive }) =>
  `rounded-full px-3 py-1.5 text-sm transition ${
    isActive
      ? 'bg-relic-gold/15 text-relic-gold-dim dark:text-relic-gold'
      : 'text-neutral-600 hover:text-relic-ink dark:text-neutral-400 dark:hover:text-relic-paper'
  }`;

export default function Navbar() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-relic-paper/90 backdrop-blur dark:border-white/10 dark:bg-relic-ink/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <NavLink to="/" className="group">
          <p className="text-xs uppercase tracking-[0.28em] text-relic-gold-dim dark:text-relic-gold">
            Metropolitan Museum
          </p>
          <h1 className="font-serif text-3xl font-semibold text-relic-ink dark:text-relic-paper">
            Relics
          </h1>
        </NavLink>

        <nav className="flex flex-wrap items-center gap-2">
          <NavLink to="/" end className={navLinkClass}>
            Collection
          </NavLink>
          <NavLink to="/favorites" className={navLinkClass}>
            Favorites
          </NavLink>
          <NavLink to="/compare" className={navLinkClass}>
            Compare
          </NavLink>
          <NavLink to="/timeline" className={navLinkClass}>
            Timeline
          </NavLink>
          <button
            type="button"
            onClick={toggleTheme}
            aria-label="Toggle dark mode"
            className="ml-1 rounded-full border border-black/10 px-3 py-1.5 text-sm transition hover:border-relic-gold dark:border-white/10"
          >
            {isDark ? '☀ Light' : '☾ Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}
