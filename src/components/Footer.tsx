import { useStore } from '../store/useStore';
import { Music, Shield } from 'lucide-react';

export function Footer() {
  const { navigate, stats } = useStore();

  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-3 gap-6 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center"><Music className="w-3.5 h-3.5 text-white" /></div>
              <span className="text-white font-bold">Todo Dia um Jingle</span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">Os jingles políticos que marcaram época. Apoie seu favorito e acompanhe o ranking em tempo real.</p>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold mb-2 uppercase tracking-wider">Navegação</h4>
            <div className="space-y-1.5">
              <button onClick={() => navigate('home')} className="block text-slate-500 text-xs hover:text-white transition">Ranking</button>
              <button onClick={() => navigate('suggest')} className="block text-slate-500 text-xs hover:text-white transition">Sugerir Jingle</button>
              <button onClick={() => navigate('rules')} className="block text-slate-500 text-xs hover:text-white transition">Como Funciona</button>
            </div>
          </div>
          <div>
            <h4 className="text-white text-xs font-semibold mb-2 uppercase tracking-wider flex items-center gap-1"><Shield className="w-3 h-3" /> Sobre</h4>
            <div className="space-y-1 text-xs text-slate-500">
              <p>{stats.totalJingles} jingles no ranking</p>
              <p>{stats.totalDonations} apoios registrados</p>
              <p>Pagamento seguro via Pix</p>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-800 pt-4 text-center">
          <p className="text-[11px] text-slate-600">© {new Date().getFullYear()} Todo Dia um Jingle</p>
        </div>
      </div>
    </footer>
  );
}
