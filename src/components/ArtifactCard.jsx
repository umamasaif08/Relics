import { Link } from 'react-router-dom';
import SpotlightCard from './react-bits/SpotlightCard';
import TiltedCard from './react-bits/TiltedCard';
import FavoriteButton from './FavoriteButton';

export default function ArtifactCard({ artifact }) {
  return (
    <SpotlightCard className="group rounded-2xl border border-black/5 bg-white shadow-sm transition hover:shadow-lg dark:border-white/10 dark:bg-relic-stone">
      <Link to={`/artifact/${artifact.id}`} className="block">
        <div className="relative">
          <TiltedCard
            imageSrc={artifact.primaryImage}
            altText={artifact.title}
            containerHeight="280px"
            imageHeight="280px"
            imageWidth="100%"
            scaleOnHover={1.04}
            rotateAmplitude={10}
            className="overflow-hidden rounded-t-2xl"
          />
          <div className="absolute right-3 top-3 z-10">
            <FavoriteButton artifactId={artifact.id} />
          </div>
        </div>

        <div className="space-y-2 p-4">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-relic-gold-dim dark:text-relic-gold">
            {artifact.civilization}
          </p>
          <h3 className="font-serif text-xl leading-tight text-relic-ink group-hover:text-relic-gold-dim dark:text-relic-paper dark:group-hover:text-relic-gold">
            {artifact.title}
          </h3>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {artifact.culture || artifact.period || artifact.objectDate}
          </p>
        </div>
      </Link>
    </SpotlightCard>
  );
}
