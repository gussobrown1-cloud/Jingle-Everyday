import { Jingle } from '../types';
import { formatCompact } from '../data/mockData';
import { useStore } from '../store/useStore';
import { Heart, ChevronUp, ChevronDown, Minus, Star, Users } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  jingle: Jingle;
  maxCount: number;
  all: Jingle[];
}

export function JingleCard({ jingle, maxCount }: Props) {
  const { openJingle, openDonation } = useStore();
  const pct = maxCount > 0 ? (jingle.donationCount / maxCount) * 100 : 0;
  const posChange = jingle.previousPosition !== null ? jingle.previousPosition - jingle.rankPosition : 0;

  const medal = (pos: number) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return null;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-white rounded-xl border transition-all hover:shadow-md cursor-pointer group ${jingle.rankPosition === 1 ? 'border-brand-200 shadow-sm' : 'border-slate-200'}`}
      onClick={() => openJingle(jingle.id)}
    >
      <div className="p-3 sm:p-4">
        <div className="flex items-center gap-3">
          {/* Rank Position */}
          <div className="flex flex-col items-center gap-0.5 shrink-0">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
              jingle.rankPosition === 1 ? 'bg-brand-600 text-white' :
              jingle.rankPosition <= 3 ? 'bg-slate-800 text-white' :
              'bg-slate-100 text-slate-600'
            }`}>
              {medal(jingle.rankPosition) || jingle.rankPosition}
            </div>
            {posChange !== 0 && (
              <span className={`flex items-center text-[10px] font-semibold ${posChange > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                {posChange > 0 ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                {Math.abs(posChange)}
              </span>
            )}
            {posChange === 0 && jingle.previousPosition !== null && (
              <span className="text-[10px] text-slate-400"><Minus className="w-3 h-3" /></span>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <h3 className="font-bold text-slate-900 truncate text-sm group-hover:text-brand-700 transition">{jingle.title}</h3>
              {jingle.isFeatured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 shrink-0" />}
            </div>
            <p className="text-xs text-slate-500 truncate">{jingle.politician} · {jingle.year}</p>

            {/* Apoios */}
            <div className="flex items-center gap-1.5 mt-1.5">
              <span className="flex items-center gap-1 text-sm font-bold text-brand-600">
                <Users className="w-3.5 h-3.5" />
                {formatCompact(jingle.donationCount)} apoios
              </span>
            </div>

            {/* Progress bar */}
            <div className="mt-2">
              <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${jingle.rankPosition === 1 ? 'bg-brand-600' : 'bg-slate-300'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={(e) => { e.stopPropagation(); openDonation(jingle.id); }}
            className="shrink-0 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition hidden sm:flex items-center gap-1"
          >
            <Heart className="w-3.5 h-3.5" />
            Apoiar
          </button>
        </div>

        {/* Mobile CTA */}
        <button
          onClick={(e) => { e.stopPropagation(); openDonation(jingle.id); }}
          className="sm:hidden w-full mt-2 bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1"
        >
          <Heart className="w-3.5 h-3.5" />
          Apoiar
        </button>
      </div>
    </motion.div>
  );
}
