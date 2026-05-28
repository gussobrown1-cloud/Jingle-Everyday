import { useStore } from '../store/useStore';
import { formatCompact } from '../data/mockData';
import { ArrowDown, Lightbulb, Music, Users } from 'lucide-react';

export function HeroBanner() {
  const { navigate, getRankedJingles } = useStore();
  const top = getRankedJingles()[0];

  return (
    <section className="relative bg-slate-900 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M0 0h1v1H0zm20 0h1v1h-1zm0 20h1v1h-1zM0 20h1v1H0z\'/%3E%3C/g%3E%3C/svg%3E")' }} />

      <div className="relative max-w-4xl mx-auto px-4 py-12 md:py-16 text-center">
        <div className="inline-flex items-center gap-2 bg-brand-600/15 border border-brand-500/20 text-brand-400 px-4 py-1.5 rounded-full text-xs font-semibold mb-5 tracking-wide uppercase">
          <Music className="w-3.5 h-3.5" />
          Jingles Políticos Históricos
        </div>

        <h1 className="text-2xl md:text-4xl font-extrabold text-white leading-tight mb-3">
          Os jingles que marcaram época
        </h1>
        <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-6 leading-relaxed">
          De Getúlio a Lula, de Jânio a Collor. Apoie o jingle que marcou sua memória e ajude ele a subir no ranking.
        </p>

        {top && (
          <div className="inline-flex items-center gap-3 bg-slate-800/80 backdrop-blur border border-slate-700 rounded-xl px-4 py-2.5 mb-6">
            <span className="text-xl">🥇</span>
            <div className="text-left">
              <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium">Líder</p>
              <p className="text-white font-bold text-sm">{top.title}</p>
              <p className="text-slate-400 text-xs">{top.politician} · <Users className="w-3 h-3 inline" /> {formatCompact(top.donationCount)} apoios</p>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => document.getElementById('ranking')?.scrollIntoView({ behavior: 'smooth' })}
            className="bg-brand-600 hover:bg-brand-500 text-white font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-brand-600/20 text-sm"
          >
            <ArrowDown className="w-4 h-4" />
            Ver os 20 Jingles
          </button>
          <button
            onClick={() => navigate('suggest')}
            className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition border border-slate-700 text-sm"
          >
            <Lightbulb className="w-4 h-4" />
            Sugerir Jingle
          </button>
        </div>
      </div>
    </section>
  );
}
