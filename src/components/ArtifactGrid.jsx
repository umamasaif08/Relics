import ArtifactCard from './ArtifactCard';

export default function ArtifactGrid({ artifacts }) {
  if (artifacts.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-black/10 px-6 py-16 text-center dark:border-white/10">
        <p className="font-serif text-2xl text-neutral-700 dark:text-neutral-300">No relics match your filters</p>
        <p className="mt-2 text-sm text-neutral-500">Try adjusting search or filter options.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {artifacts.map((artifact) => (
        <ArtifactCard key={artifact.id} artifact={artifact} />
      ))}
    </div>
  );
}
