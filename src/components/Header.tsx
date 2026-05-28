import { Music, HelpCircle, Settings, Home, Lightbulb, Menu, X } from 'lucide-react';
import { useStore } from '../store/useStore';
import { useState } from 'react';

export function Header() {
  const { page, navigate, isAdmin, logoutAdmin } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);

  const nav = (p: typeof page) => { navigate(p); setMobileOpen(false); };

  return (
    <header className="sticky top-0 z-50 bg-slate-900 border-b border-slate-800">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <button onClick={() => nav('home')} className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center group-hover:bg-brand-500 transition">
            <Music className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold text-lg tracking-tight">Todo Dia um Jingle</span>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          <NavBtn active={page === 'home'} onClick={() => nav('home')} icon={<Home className="w-4 h-4" />} label="Ranking" />
          <NavBtn active={page === 'suggest'} onClick={() => nav('suggest')} icon={<Lightbulb className="w-4 h-4" />} label="Sugerir" />
          <NavBtn active={page === 'rules'} onClick={() => nav('rules')} icon={<HelpCircle className="w-4 h-4" />} label="Como Funciona" />
          <NavBtn active={page === 'admin'} onClick={() => nav('admin')} icon={<Settings className="w-4 h-4" />} label={isAdmin ? 'Admin' : ''} />
          {isAdmin && <button onClick={logoutAdmin} className="text-xs text-slate-500 hover:text-white ml-2 transition">Sair</button>}
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-slate-400 hover:text-white p-1">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Nav */}
      {mobileOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 px-4 pb-4 space-y-1">
          <MobileBtn label="Ranking" onClick={() => nav('home')} active={page === 'home'} />
          <MobileBtn label="Sugerir Jingle" onClick={() => nav('suggest')} active={page === 'suggest'} />
          <MobileBtn label="Como Funciona" onClick={() => nav('rules')} active={page === 'rules'} />
          <MobileBtn label="Admin" onClick={() => nav('admin')} active={page === 'admin'} />
        </div>
      )}
    </header>
  );
}

function NavBtn({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition ${active ? 'bg-brand-600/20 text-brand-400' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

function MobileBtn({ label, onClick, active }: { label: string; onClick: () => void; active: boolean }) {
  return (
    <button onClick={onClick} className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition ${active ? 'bg-brand-600/20 text-brand-400' : 'text-slate-300 hover:bg-slate-800'}`}>
      {label}
    </button>
  );
}
