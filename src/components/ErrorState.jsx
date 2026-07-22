export default function ErrorState({ message, onRetry }) {
  return (
    <div className="flex min-h-[320px] flex-col items-center justify-center rounded-3xl border border-red-200 bg-red-50 px-6 py-12 text-center dark:border-red-900/40 dark:bg-red-950/20">
      <div className="mb-3 text-4xl">⚠</div>
      <h2 className="font-serif text-2xl text-red-900 dark:text-red-200">Unable to load relics</h2>
      <p className="mt-2 max-w-md text-sm text-red-700 dark:text-red-300">{message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="mt-6 rounded-full bg-red-800 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
      >
        Try again
      </button>
    </div>
  );
}
