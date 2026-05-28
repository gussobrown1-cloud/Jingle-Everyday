import { useState } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency, formatCompact } from '../data/mockData';
import { LayoutDashboard, Music, Lightbulb, CreditCard, Check, X, Eye, TrendingUp, Users, Clock, ArrowLeft, LogIn, Star } from 'lucide-react';

export function AdminPanel() {
  const { isAdmin, loginAdmin, navigate, adminTab, setAdminTab, stats, jingles, suggestions, donations, approveSuggestion, rejectSuggestion, toggleFeature, getPendingSuggestions } = useStore();
  const [pw, setPw] = useState('');
  const [err, setErr] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAdmin(pw)) { setErr(true); setTimeout(() => setErr(false), 2000); }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-sm w-full">
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3"><LogIn className="w-6 h-6 text-slate-600" /></div>
            <h1 className="text-lg font-bold text-slate-900">Administração</h1>
            <p className="text-xs text-slate-500 mt-1">Acesso restrito</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-3">
            <input type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Senha" className={`w-full px-3 py-2.5 border rounded-lg text-sm outline-none transition ${err ? 'border-red-400 bg-red-50' : 'border-slate-200 focus:ring-2 focus:ring-brand-500 focus:border-brand-500'}`} />
            {err && <p className="text-red-500 text-xs">Senha incorreta</p>}
            <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-2.5 rounded-lg transition text-sm">Entrar</button>
          </form>
          <button onClick={() => navigate('home')} className="w-full mt-3 text-slate-500 text-xs flex items-center justify-center gap-1 hover:text-slate-700"><ArrowLeft className="w-3 h-3" /> Voltar ao site</button>
          <p className="text-[10px] text-slate-400 text-center mt-4">Demo: admin123</p>
        </div>
      </div>
    );
  }

  const pending = getPendingSuggestions();
  const confirmed = donations.filter(d => d.paymentStatus === 'confirmed');

  const tabs = [
    { id: 'dashboard' as const, icon: <LayoutDashboard className="w-4 h-4" />, label: 'Dashboard' },
    { id: 'jingles' as const, icon: <Music className="w-4 h-4" />, label: `Jingles (${jingles.length})` },
    { id: 'suggestions' as const, icon: <Lightbulb className="w-4 h-4" />, label: `Sugestões (${pending.length})` },
    { id: 'payments' as const, icon: <CreditCard className="w-4 h-4" />, label: 'Pagamentos' },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2"><Music className="w-5 h-5 text-brand-400" /><span className="text-white font-bold text-sm">Admin</span></div>
          <button onClick={() => navigate('home')} className="text-xs text-slate-400 hover:text-white flex items-center gap-1"><Eye className="w-3 h-3" /> Ver site</button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setAdminTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition ${adminTab === t.id ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {adminTab === 'dashboard' && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Metric icon={<TrendingUp className="w-4 h-4 text-emerald-500" />} label="Total" value={formatCurrency(stats.totalRaised)} />
              <Metric icon={<Users className="w-4 h-4 text-brand-500" />} label="Apoios" value={formatCompact(stats.totalDonations)} />
              <Metric icon={<Music className="w-4 h-4 text-slate-500" />} label="Jingles" value={jingles.length.toString()} />
              <Metric icon={<Clock className="w-4 h-4 text-amber-500" />} label="Pendentes" value={pending.length.toString()} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-5">
              <h2 className="font-bold text-slate-900 text-sm mb-3">Últimos apoios</h2>
              <div className="space-y-2">
                {confirmed.slice(0, 5).map(d => {
                  const j = jingles.find(jj => jj.id === d.jingleId);
                  return (
                    <div key={d.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                      <div><p className="font-medium text-slate-900 text-sm">{d.isAnonymous ? 'Anônimo' : d.donorName || 'Apoiador'}</p><p className="text-xs text-slate-500">{j?.title} — {j?.politician}</p></div>
                      <span className="font-bold text-emerald-600 text-sm">{formatCurrency(d.amount)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {adminTab === 'jingles' && (
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="p-4 border-b border-slate-100"><h2 className="font-bold text-slate-900 text-sm">Jingles ({jingles.length})</h2></div>
            <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
              {jingles.map(j => (
                <div key={j.id} className="p-3 flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${j.rankPosition <= 3 ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600'}`}>#{j.rankPosition}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5"><p className="font-medium text-slate-900 text-sm truncate">{j.title}</p>{j.isFeatured && <Star className="w-3 h-3 text-amber-500 fill-amber-500" />}</div>
                    <p className="text-xs text-slate-500">{j.politician} · {j.year} · {formatCurrency(j.totalRaised)}</p>
                  </div>
                  <button onClick={() => toggleFeature(j.id)} className={`p-1.5 rounded-lg transition text-xs ${j.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`} title="Destaque"><Star className="w-3 h-3" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {adminTab === 'suggestions' && (
          <div className="space-y-3">
            {suggestions.length === 0 ? <div className="bg-white rounded-xl border border-slate-200 p-8 text-center text-slate-400 text-sm">Nenhuma sugestão.</div> : suggestions.map(s => (
              <div key={s.id} className="bg-white rounded-xl border border-slate-200 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-900 text-sm">{s.title}</h3>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${s.status === 'pending' ? 'bg-amber-100 text-amber-700' : s.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                        {s.status === 'pending' ? 'Pendente' : s.status === 'approved' ? 'Aprovado' : 'Rejeitado'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{s.description}</p>
                    <p className="text-[11px] text-slate-400">Por {s.authorName} · {new Date(s.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                  {s.status === 'pending' && (
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => approveSuggestion(s.id)} className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg hover:bg-emerald-200"><Check className="w-4 h-4" /></button>
                      <button onClick={() => rejectSuggestion(s.id)} className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"><X className="w-4 h-4" /></button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {adminTab === 'payments' && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-bold text-slate-900 text-sm">Pagamentos</h2>
              <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">Exportar CSV</button>
            </div>
            <div className="overflow-x-auto max-h-[500px]">
              <table className="w-full">
                <thead className="bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 uppercase">Data</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 uppercase">Jingle</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 uppercase">Doador</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 uppercase">Valor</th>
                    <th className="px-4 py-2.5 text-left text-[11px] font-medium text-slate-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {donations.map(d => {
                    const j = jingles.find(jj => jj.id === d.jingleId);
                    return (
                      <tr key={d.id}>
                        <td className="px-4 py-3 text-xs text-slate-500">{new Date(d.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td className="px-4 py-3 text-xs text-slate-900 font-medium">{j?.title}</td>
                        <td className="px-4 py-3 text-xs text-slate-500">{d.isAnonymous ? 'Anônimo' : d.donorName || '-'}</td>
                        <td className="px-4 py-3 text-xs font-bold text-emerald-600">{formatCurrency(d.amount)}</td>
                        <td className="px-4 py-3"><span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${d.paymentStatus === 'confirmed' ? 'bg-emerald-100 text-emerald-700' : d.paymentStatus === 'pending' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>{d.paymentStatus === 'confirmed' ? 'Confirmado' : d.paymentStatus === 'pending' ? 'Pendente' : 'Falhou'}</span></td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">{icon}</div>
      <div><p className="text-[11px] text-slate-500">{label}</p><p className="text-lg font-bold text-slate-900">{value}</p></div>
    </div>
  );
}
