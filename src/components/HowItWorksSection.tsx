import { Music, Heart, QrCode, TrendingUp } from 'lucide-react';

const steps = [
  { icon: <Music className="w-5 h-5" />, title: 'Escolha', desc: 'Navegue pelo ranking e escolha seu jingle' },
  { icon: <Heart className="w-5 h-5" />, title: 'Apoie', desc: 'Clique em apoiar e escolha o valor' },
  { icon: <QrCode className="w-5 h-5" />, title: 'Pague', desc: 'Escaneie o QR Code Pix' },
  { icon: <TrendingUp className="w-5 h-5" />, title: 'Suba', desc: 'O jingle sobe no ranking em tempo real' },
];

export function HowItWorksSection() {
  return (
    <section className="py-12 px-4 bg-white border-t border-slate-100">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-lg font-bold text-slate-900 text-center mb-1">Como funciona?</h2>
        <p className="text-sm text-slate-500 text-center mb-8">Quatro passos simples.</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((s, i) => (
            <div key={i} className="text-center">
              <div className="relative inline-block">
                <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto mb-2">{s.icon}</div>
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-0.5">{s.title}</h3>
              <p className="text-xs text-slate-500">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
