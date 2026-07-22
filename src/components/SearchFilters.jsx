export default function SearchFilters({ filters, onChange, options }) {
  const selectClassName =
    'w-full rounded-xl border border-black/10 bg-white px-3 py-2.5 text-sm outline-none transition focus:border-relic-gold dark:border-white/10 dark:bg-relic-stone dark:text-relic-paper';

  return (
    <div className="grid gap-4 rounded-3xl border border-black/5 bg-white/80 p-4 backdrop-blur dark:border-white/10 dark:bg-relic-stone/80 md:grid-cols-2 xl:grid-cols-4">
      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Search</span>
        <input
          type="search"
          value={filters.search}
          onChange={(event) => onChange({ ...filters, search: event.target.value })}
          placeholder="Search by name or artist..."
          className={selectClassName}
        />
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Civilization</span>
        <select
          value={filters.civilization}
          onChange={(event) => onChange({ ...filters, civilization: event.target.value })}
          className={selectClassName}
        >
          <option value="">All civilizations</option>
          {options.civilizations.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Category</span>
        <select
          value={filters.category}
          onChange={(event) => onChange({ ...filters, category: event.target.value })}
          className={selectClassName}
        >
          <option value="">All categories</option>
          {options.categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-2">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-neutral-500">Era</span>
        <select
          value={filters.era}
          onChange={(event) => onChange({ ...filters, era: event.target.value })}
          className={selectClassName}
        >
          <option value="">All eras</option>
          {options.eras.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
