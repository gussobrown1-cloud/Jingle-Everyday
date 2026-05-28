import { useStore } from '../store/useStore';
import { formatCompact } from '../data/mockData';
import { Music, Zap, Heart } from 'lucide-react';

export function StatsBar() {
  const { stats } = useStore();

  return (
    <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
      <div className="max-w-6xl mx-auto grid grid-cols-3 gap-3">
        <Stat icon={<Heart className="w-4 h-4 text-brand-400" />} label="Total de apoios" value={formatCompact(stats.totalDonations)} accent="text-brand-400" />
        <Stat icon={<Music className="w-4 h-4 text-slate-400" />} label="Jingles" value={stats.totalJingles.toString()} />
        <Stat icon={<Zap className="w-4 h-4 text-amber-400" />} label="Apoios hoje" value={stats.todayDonations.toString()} accent="text-amber-400" />
      </div>
    </div>
  );
}

function Stat({ icon, label, value, accent }: { icon: React.ReactNode; label: string; value: string; accent?: string }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0">{icon}</div>
      <div className="min-w-0">
        <p className="text-[11px] text-slate-500 truncate">{label}</p>
        <p className={`text-sm font-bold ${accent || 'text-white'} truncate`}>{value}</p>
      </div>
    </div>
  );
}
