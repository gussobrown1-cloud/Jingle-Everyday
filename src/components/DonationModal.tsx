import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { formatCurrency } from '../data/mockData';
import { X, Copy, Check, Clock, ArrowRight, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const PRESETS = [5, 10, 25, 50, 100];

export function DonationModal() {
  const { showDonation, closeDonation, selectedJingleId, getJingle, donationStep, activeDonation, submitDonation, confirmPayment } = useStore();
  const jingle = selectedJingleId ? getJingle(selectedJingleId) : undefined;

  const [amount, setAmount] = useState(10);
  const [custom, setCustom] = useState('');
  const [name, setName] = useState('');
  const [msg, setMsg] = useState('');
  const [anon, setAnon] = useState(false);
  const [copied, setCopied] = useState(false);
  const [timer, setTimer] = useState(1800);

  useEffect(() => {
    if (showDonation) { setAmount(10); setCustom(''); setName(''); setMsg(''); setAnon(false); setCopied(false); setTimer(1800); }
  }, [showDonation]);

  useEffect(() => {
    if (donationStep !== 'pix' || timer <= 0) return;
    const t = setInterval(() => setTimer(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [donationStep, timer]);

  if (!showDonation || !jingle) return null;

  const fmtTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const handleCustom = (v: string) => {
    setCustom(v);
    const n = parseFloat(v.replace(/[^0-9.,]/g, '').replace(',', '.'));
    if (!isNaN(n) && n > 0) setAmount(n);
  };

  const handleSubmit = () => {
    if (amount < 1) return;
    submitDonation(jingle.id, { amount, donorName: name, donorMessage: msg, isAnonymous: anon });
  };

  const handleCopy = () => {
    if (activeDonation?.pixCode) { navigator.clipboard.writeText(activeDonation.pixCode); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const updatedJingle = useStore.getState().getJingle(jingle.id);

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-0 sm:p-4" onClick={closeDonation}>
        <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }} className="bg-white w-full sm:max-w-md sm:rounded-2xl rounded-t-2xl max-h-[92vh] overflow-y-auto" onClick={e => e.stopPropagation()}>

          {/* Header */}
          <div className="sticky top-0 z-10 bg-slate-900 text-white px-5 py-4 flex items-center justify-between sm:rounded-t-2xl rounded-t-2xl">
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider font-medium">
                {donationStep === 'form' ? 'Apoiar' : donationStep === 'pix' ? 'Pagamento Pix' : 'Confirmado'}
              </p>
              <p className="font-bold text-sm truncate mt-0.5">{jingle.title}</p>
              <p className="text-xs text-slate-500">{jingle.politician}</p>
            </div>
            <button onClick={closeDonation} className="p-1.5 hover:bg-slate-800 rounded-lg transition"><X className="w-5 h-5" /></button>
          </div>

          <div className="p-5">
            {/* FORM */}
            {donationStep === 'form' && (
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Valor do apoio</label>
                  <div className="grid grid-cols-5 gap-2">
                    {PRESETS.map(v => (
                      <button key={v} onClick={() => { setAmount(v); setCustom(''); }} className={`py-2.5 rounded-lg font-bold text-sm transition border ${amount === v && !custom ? 'bg-brand-600 text-white border-brand-600' : 'bg-white text-slate-700 border-slate-200 hover:border-brand-300'}`}>
                        R${v}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Outro valor</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">R$</span>
                    <input type="text" value={custom} onChange={e => handleCustom(e.target.value)} placeholder="0,00" className="w-full pl-9 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Seu nome <span className="text-slate-400 font-normal">(opcional)</span></label>
                  <input type="text" value={name} onChange={e => setName(e.target.value)} disabled={anon} placeholder="Como quer aparecer?" className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-sm disabled:bg-slate-50 disabled:text-slate-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Mensagem <span className="text-slate-400 font-normal">(opcional)</span></label>
                  <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={2} placeholder="Deixe uma mensagem de apoio..." className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none transition text-sm resize-none" />
                </div>
                <label className="flex items-center gap-2.5 cursor-pointer">
                  <input type="checkbox" checked={anon} onChange={e => setAnon(e.target.checked)} className="w-4 h-4 text-brand-600 border-slate-300 rounded focus:ring-brand-500" />
                  <span className="text-sm text-slate-600">Apoiar anonimamente</span>
                </label>
                <button onClick={handleSubmit} disabled={amount < 1} className="w-full bg-brand-600 hover:bg-brand-700 disabled:opacity-40 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm">
                  Gerar Pix — {formatCurrency(amount)}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* PIX */}
            {donationStep === 'pix' && activeDonation && (
              <div className="space-y-5">
                <p className="text-center text-2xl font-bold text-slate-900">{formatCurrency(activeDonation.amount)}</p>

                <div className="flex justify-center">
                  <div className="w-52 h-52 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-slate-400 bg-slate-50">
                    <QrCode className="w-20 h-20 mb-2" />
                    <span className="text-xs font-medium">QR Code Pix</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-500 mb-1.5">Código Pix (copia e cola)</label>
                  <div className="flex gap-2">
                    <input type="text" readOnly value={activeDonation.pixCode || ''} className="flex-1 px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono truncate" />
                    <button onClick={handleCopy} className={`px-4 py-2.5 rounded-lg text-sm font-medium flex items-center gap-1.5 transition ${copied ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-white hover:bg-slate-800'}`}>
                      {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      {copied ? 'Copiado' : 'Copiar'}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-slate-500">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm font-mono">{fmtTime(timer)}</span>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
                  <div className="flex items-center justify-center gap-2 text-amber-700 text-sm font-medium">
                    <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
                    Aguardando pagamento
                  </div>
                  <p className="text-xs text-amber-600 mt-1">O ranking atualiza automaticamente após a confirmação.</p>
                </div>

                <button onClick={confirmPayment} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition text-sm">
                  <Check className="w-4 h-4" />
                  Simular Confirmação (Demo)
                </button>
                <p className="text-[11px] text-slate-400 text-center">Em produção, a confirmação é automática via webhook do provedor Pix.</p>
              </div>
            )}

            {/* CONFIRMED */}
            {donationStep === 'confirmed' && (
              <div className="text-center space-y-5 py-4">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                  <Check className="w-8 h-8 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900">Apoio registrado!</h3>
                  <p className="text-slate-500 text-sm mt-1">Seu apoio foi computado com sucesso.</p>
                </div>
                {updatedJingle && (
                  <div className="bg-brand-50 border border-brand-200 rounded-xl p-4">
                    <p className="text-xs text-brand-600 uppercase tracking-wider font-medium">Posição no ranking</p>
                    <p className="text-4xl font-extrabold text-brand-700 mt-1">#{updatedJingle.rankPosition}</p>
                    <p className="text-sm text-brand-600 mt-1">{updatedJingle.title}</p>
                  </div>
                )}
                <button onClick={closeDonation} className="w-full bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3.5 rounded-xl transition text-sm">Voltar ao Ranking</button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
