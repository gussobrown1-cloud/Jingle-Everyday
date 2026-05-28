import { useStore } from '../store/useStore';
import { ArrowLeft, Music, Heart, QrCode, TrendingUp, Trophy, Eye, Shield, Lightbulb, ChevronRight } from 'lucide-react';

export function HowItWorks() {
  const { navigate } = useStore();

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"><ArrowLeft className="w-4 h-4" /> Voltar</button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-slate-900 text-center mb-1">Como funciona?</h1>
        <p className="text-slate-500 text-center text-sm mb-8">Simples, rápido e transparente.</p>

        {/* Steps */}
        <div className="space-y-3 mb-10">
          {[
            { icon: <Music className="w-5 h-5" />, title: 'Escolha', desc: 'Navegue pelo ranking e escolha seu jingle favorito.' },
            { icon: <Heart className="w-5 h-5" />, title: 'Apoie', desc: 'Clique em "Apoiar" e escolha o valor que quiser, a partir de R$ 1.' },
            { icon: <QrCode className="w-5 h-5" />, title: 'Pague via Pix', desc: 'Escaneie o QR Code ou copie o código Pix. Rápido e seguro.' },
            { icon: <TrendingUp className="w-5 h-5" />, title: 'Veja subir', desc: 'Após confirmação, o valor é computado e o jingle sobe no ranking.' },
          ].map((s, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-brand-600 text-white flex items-center justify-center font-bold shrink-0">{i + 1}</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5"><span className="text-brand-600">{s.icon}</span><h3 className="font-bold text-slate-900 text-sm">{s.title}</h3></div>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Rules */}
        <h2 className="text-lg font-bold text-slate-900 text-center mb-4">Regras</h2>
        <div className="grid sm:grid-cols-2 gap-3 mb-10">
          {[
            { icon: <Trophy className="w-4 h-4 text-amber-600" />, t: 'Ranking por valor', d: 'Quem arrecada mais fica no topo.' },
            { icon: <Eye className="w-4 h-4 text-brand-600" />, t: 'Transparência', d: 'Todos os valores são públicos.' },
            { icon: <Lightbulb className="w-4 h-4 text-amber-500" />, t: 'Sugestões', d: 'Qualquer pessoa pode sugerir jingles.' },
            { icon: <Shield className="w-4 h-4 text-emerald-600" />, t: 'Segurança', d: 'Pix é instantâneo e seguro.' },
          ].map((r, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200 p-4">
              <div className="flex items-center gap-2 mb-1">{r.icon}<h3 className="font-semibold text-slate-900 text-sm">{r.t}</h3></div>
              <p className="text-xs text-slate-500">{r.d}</p>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <h2 className="text-lg font-bold text-slate-900 text-center mb-4">Perguntas frequentes</h2>
        <div className="space-y-2 mb-10">
          {[
            ['Qual o valor mínimo?', 'R$ 1,00. Qualquer valor acima disso é aceito.'],
            ['Posso apoiar anonimamente?', 'Sim. O valor é computado, mas seu nome não aparece.'],
            ['Como o ranking funciona?', 'Ordenado por total arrecadado. Quanto mais apoios, mais alto no ranking.'],
            ['O que acontece com o dinheiro?', 'Destinado ao projeto Todo Dia um Jingle e à produção de conteúdo. Tudo transparente.'],
            ['Posso sugerir um jingle?', 'Sim! Use o formulário de sugestão. Se aprovado, entra no ranking.'],
          ].map(([q, a], i) => (
            <details key={i} className="bg-white rounded-xl border border-slate-200 group">
              <summary className="p-4 text-sm font-medium text-slate-900 cursor-pointer flex items-center justify-between">
                {q}<ChevronRight className="w-4 h-4 text-slate-400 transition-transform group-open:rotate-90 shrink-0" />
              </summary>
              <p className="px-4 pb-4 text-sm text-slate-500">{a}</p>
            </details>
          ))}
        </div>

        <div className="text-center">
          <button onClick={() => navigate('home')} className="bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3 rounded-xl transition text-sm">Ver Ranking</button>
        </div>
      </div>
    </div>
  );
}
