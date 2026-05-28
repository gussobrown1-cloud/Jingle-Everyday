import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, Send, Check, Lightbulb } from 'lucide-react';

export function SuggestForm() {
  const { submitSuggestion, navigate } = useStore();
  const [done, setDone] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', authorName: '', authorEmail: '', authorPhone: '' });
  const set = (k: keyof typeof form, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.authorName) return;
    submitSuggestion(form);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-surface-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl border border-slate-200 p-8 max-w-md w-full text-center">
          <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"><Check className="w-7 h-7 text-emerald-600" /></div>
          <h1 className="text-xl font-bold text-slate-900 mb-2">Sugestão enviada!</h1>
          <p className="text-slate-500 text-sm mb-6">Analisaremos em até 48h. Se o jingle existir e for válido, ele entra no ranking.</p>
          <button onClick={() => navigate('home')} className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3 rounded-xl transition text-sm">Voltar ao Ranking</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      <div className="bg-slate-900 border-b border-slate-800 px-4 py-3">
        <div className="max-w-lg mx-auto">
          <button onClick={() => navigate('home')} className="flex items-center gap-2 text-slate-400 hover:text-white transition text-sm"><ArrowLeft className="w-4 h-4" /> Voltar</button>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex w-12 h-12 bg-amber-100 rounded-xl items-center justify-center mb-3"><Lightbulb className="w-6 h-6 text-amber-600" /></div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Sugerir jingle político</h1>
          <p className="text-slate-500 text-sm">Conhece um jingle histórico que não está na lista? Conta pra gente!</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
          <Field label="Nome do jingle *" value={form.title} onChange={v => set('title', v)} placeholder='Ex: "Jingle do Quércia"' required />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Político e campanha *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={3} required placeholder="De quem é o jingle? Qual campanha? Qual ano? Onde consegue ouvir?" className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-sm resize-none" />
          </div>
          <Field label="Seu nome *" value={form.authorName} onChange={v => set('authorName', v)} placeholder="Como quer ser creditado?" required />
          <Field label="E-mail (opcional)" type="email" value={form.authorEmail} onChange={v => set('authorEmail', v)} placeholder="Para avisarmos se for aprovado" />
          <Field label="WhatsApp (opcional)" type="tel" value={form.authorPhone} onChange={v => set('authorPhone', v)} placeholder="(11) 99999-9999" />

          <div className="bg-slate-50 rounded-lg p-3 text-xs text-slate-500 space-y-1">
            <p className="font-medium text-slate-600">Como funciona:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>Verificamos se o jingle existe e é válido</li>
              <li>Se aprovado, adicionamos ao ranking</li>
              <li>Você será creditado pela sugestão</li>
            </ul>
          </div>

          <button type="submit" className="w-full bg-brand-600 hover:bg-brand-700 text-white font-semibold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm">
            <Send className="w-4 h-4" /> Enviar Sugestão
          </button>
        </form>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', required = false }: { label: string; value: string; onChange: (v: string) => void; placeholder: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1.5">{label}</label>
      <input type={type} value={value} onChange={e => onChange(e.target.value)} required={required} placeholder={placeholder} className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-sm" />
    </div>
  );
}
