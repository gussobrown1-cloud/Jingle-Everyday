import { useStore } from '../store/useStore';
import { formatCompact, timeAgo } from '../data/mockData';
import { ArrowLeft, Heart, Users, Star, Share2, Calendar } from 'lucide-react';

export function JingleDetail() {
  const { selectedJingleId, getJingle, getJingleDonations, navigate, openDonation } = useStore();
  const jingle = selectedJingleId ? getJingle(selectedJingleId) : undefined;
  if (!jingle) return null;

  const donations = getJingleDonations(jingle.id).slice(0, 15);

  const medal = (p: number) => p === 1 ? '🥇' : p === 2 ? '🥈' : p === 3 ? '🥉' : `#${p}`;

  const share = () => {
    if (navigator.share) navigator.share({ title: `${jingle.title} — Todo Dia um Jingle`, text: `Apoie "${jingle.title}" de ${jingle.politician}!`, url: window.location.href });
  };

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Ranking
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-5">
        {/* Hero card */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="bg-slate-900 p-6 text-center text-white">
            <span className="text-4xl">{medal(jingle.rankPosition)}</span>
            <h1 className="text-xl font-bold mt-2 flex items-center justify-center gap-2">
              {jingle.title}
              {jingle.isFeatured && <Star className="w-5 h-5 text-amber-400 fill-amber-400" />}
            </h1>
            <p className="text-slate-400 text-sm mt-1">{jingle.politician} · {jingle.year}</p>
          </div>

          <div className="flex items-center justify-center gap-2 py-5 bg-slate-50">
            <Users className="w-5 h-5 text-brand-600" />
            <span className="text-2xl font-bold text-brand-600">{formatCompact(jingle.donationCount)}</span>
            <span className="text-slate-500 text-sm">apoios</span>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button onClick={() => openDonation(jingle.id)} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm shadow-sm">
            <Heart className="w-4 h-4" /> Apoiar
          </button>
          <button onClick={share} className="bg-white hover:bg-slate-50 text-slate-700 font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm border border-slate-200">
            <Share2 className="w-4 h-4" /> Compartilhar
          </button>
        </div>

        {/* Recent donations */}
        <div className="bg-white rounded-xl border border-slate-200 p-5">
          <h2 className="font-bold text-slate-900 mb-4 flex items-center gap-2 text-sm"><Heart className="w-4 h-4 text-brand-500" /> Últimos apoios</h2>
          {donations.length > 0 ? (
            <div className="space-y-3">
              {donations.map(d => (
                <div key={d.id} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                  <div className="w-9 h-9 rounded-lg bg-slate-200 flex items-center justify-center text-slate-600 font-bold text-sm shrink-0">
                    {d.isAnonymous ? '?' : (d.donorName?.[0]?.toUpperCase() || '?')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-slate-900 text-sm truncate">{d.isAnonymous ? 'Anônimo' : d.donorName || 'Apoiador'}</p>
                    {d.donorMessage && <p className="text-xs text-slate-500 truncate mt-0.5">"{d.donorMessage}"</p>}
                    <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1"><Calendar className="w-3 h-3" />{timeAgo(d.paidAt || d.createdAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-slate-400 py-6 text-sm">Nenhum apoio ainda. Seja o primeiro!</p>
          )}
        </div>
      </div>
    </div>
  );
}
