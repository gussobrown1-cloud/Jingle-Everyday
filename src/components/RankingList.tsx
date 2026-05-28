import { useStore } from '../store/useStore';
import { JingleCard } from './JingleCard';

export function RankingList() {
  const { getRankedJingles } = useStore();
  const ranked = getRankedJingles();
  const maxCount = ranked.length > 0 ? ranked[0].donationCount : 1;

  return (
    <section id="ranking" className="py-10 px-4 bg-surface-50">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Ranking</h2>
            <p className="text-sm text-slate-500">Ordenado por quantidade de apoios</p>
          </div>
          <span className="text-xs text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">{ranked.length} jingles</span>
        </div>
        <div className="space-y-3">
          {ranked.map((j) => (
            <JingleCard key={j.id} jingle={j} maxCount={maxCount} all={ranked} />
          ))}
        </div>
        {ranked.length === 0 && (
          <div className="text-center py-16 text-slate-400">Nenhum jingle no ranking ainda.</div>
        )}
      </div>
    </section>
  );
}
