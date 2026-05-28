import { create } from 'zustand';
import type { Jingle, Donation, Suggestion, Stats, DonationFormData, Page, AdminTab, DonationStep } from '../types';
import { mockJingles, mockDonations, mockSuggestions, mockStats } from '../data/mockData';

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface Store {
  jingles: Jingle[];
  donations: Donation[];
  suggestions: Suggestion[];
  stats: Stats;

  page: Page;
  selectedJingleId: string | null;
  showDonation: boolean;
  donationStep: DonationStep;
  activeDonation: Donation | null;
  isAdmin: boolean;
  adminTab: AdminTab;
  toasts: Toast[];

  navigate: (page: Page) => void;
  openJingle: (id: string) => void;
  openDonation: (jingleId: string) => void;
  closeDonation: () => void;
  submitDonation: (jingleId: string, form: DonationFormData) => void;
  confirmPayment: () => void;
  submitSuggestion: (data: { title: string; description: string; authorName: string; authorEmail: string; authorPhone: string }) => void;
  approveSuggestion: (id: string) => void;
  rejectSuggestion: (id: string) => void;
  toggleFeature: (id: string) => void;
  loginAdmin: (pw: string) => boolean;
  logoutAdmin: () => void;
  setAdminTab: (tab: AdminTab) => void;
  toast: (message: string, type?: Toast['type']) => void;
  dismissToast: (id: string) => void;

  getJingle: (id: string) => Jingle | undefined;
  getJingleDonations: (id: string) => Donation[];
  getRankedJingles: () => Jingle[];
  getPendingSuggestions: () => Suggestion[];
}

export const useStore = create<Store>((set, get) => ({
  jingles: mockJingles,
  donations: mockDonations,
  suggestions: mockSuggestions,
  stats: mockStats,

  page: 'home',
  selectedJingleId: null,
  showDonation: false,
  donationStep: 'form',
  activeDonation: null,
  isAdmin: false,
  adminTab: 'dashboard',
  toasts: [],

  navigate: (page: Page) => set({ page, selectedJingleId: null }),

  openJingle: (id: string) => set({ page: 'jingle', selectedJingleId: id }),

  openDonation: (jingleId: string) => set({ showDonation: true, donationStep: 'form', activeDonation: null, selectedJingleId: jingleId }),

  closeDonation: () => set({ showDonation: false, donationStep: 'form', activeDonation: null }),

  submitDonation: (jingleId: string, form: DonationFormData) => {
    const d: Donation = {
      id: `d_${Date.now()}`,
      jingleId,
      amount: form.amount,
      donorName: form.isAnonymous ? null : (form.donorName || null),
      donorMessage: form.donorMessage || null,
      isAnonymous: form.isAnonymous,
      paymentStatus: 'pending',
      pixCode: '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-835d-02f863ad91150520400005303986540' + form.amount.toFixed(2).replace('.', '') + '5802BR5925TODO DIA UM JINGLE6009SAO PAULO62070503***63041D3D',
      paidAt: null,
      createdAt: new Date().toISOString(),
    };
    set({ donations: [d, ...get().donations], activeDonation: d, donationStep: 'pix' });
  },

  confirmPayment: () => {
    const { activeDonation, donations, jingles, stats } = get();
    if (!activeDonation) return;

    const updated = donations.map(d =>
      d.id === activeDonation.id ? { ...d, paymentStatus: 'confirmed' as const, paidAt: new Date().toISOString() } : d
    );

    let newJingles = jingles.map(j =>
      j.id === activeDonation.jingleId
        ? { ...j, totalRaised: j.totalRaised + activeDonation.amount, donationCount: j.donationCount + 1, todayRaised: j.todayRaised + activeDonation.amount, weekRaised: j.weekRaised + activeDonation.amount }
        : j
    );

    // recalculate ranks by donation count
    const oldPositions = Object.fromEntries(newJingles.map(j => [j.id, j.rankPosition]));
    newJingles = newJingles
      .sort((a, b) => b.donationCount - a.donationCount || b.totalRaised - a.totalRaised)
      .map((j, i) => ({ ...j, previousPosition: oldPositions[j.id], rankPosition: i + 1 }));

    set({
      donations: updated,
      jingles: newJingles,
      stats: { ...stats, totalRaised: stats.totalRaised + activeDonation.amount, totalDonations: stats.totalDonations + 1, todayRaised: stats.todayRaised + activeDonation.amount, todayDonations: stats.todayDonations + 1 },
      donationStep: 'confirmed',
      activeDonation: { ...activeDonation, paymentStatus: 'confirmed', paidAt: new Date().toISOString() },
    });

    const jingle = newJingles.find(j => j.id === activeDonation.jingleId);
    get().toast(`Apoio confirmado! ${jingle?.title} agora é #${jingle?.rankPosition}`, 'success');
  },

  submitSuggestion: (data) => {
    const s: Suggestion = { id: `s_${Date.now()}`, ...data, status: 'pending', adminNotes: '', createdAt: new Date().toISOString(), reviewedAt: null };
    set({ suggestions: [s, ...get().suggestions] });
    get().toast('Sugestão enviada com sucesso!', 'success');
  },

  approveSuggestion: (id: string) => set({ suggestions: get().suggestions.map(s => s.id === id ? { ...s, status: 'approved' as const, reviewedAt: new Date().toISOString() } : s) }),

  rejectSuggestion: (id: string) => set({ suggestions: get().suggestions.map(s => s.id === id ? { ...s, status: 'rejected' as const, reviewedAt: new Date().toISOString() } : s) }),

  toggleFeature: (id: string) => set({ jingles: get().jingles.map(j => j.id === id ? { ...j, isFeatured: !j.isFeatured, status: (!j.isFeatured ? 'featured' : 'published') as Jingle['status'] } : j) }),

  loginAdmin: (pw: string) => {
    if (pw === 'admin123') { set({ isAdmin: true, page: 'admin' }); return true; }
    return false;
  },
  logoutAdmin: () => set({ isAdmin: false, page: 'home' }),
  setAdminTab: (tab: AdminTab) => set({ adminTab: tab }),

  toast: (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    set({ toasts: [...get().toasts, { id, message, type }] });
    setTimeout(() => get().dismissToast(id), 4000);
  },
  dismissToast: (id: string) => set({ toasts: get().toasts.filter(t => t.id !== id) }),

  getJingle: (id: string) => get().jingles.find(j => j.id === id),
  getJingleDonations: (id: string) => get().donations.filter(d => d.jingleId === id && d.paymentStatus === 'confirmed'),
  getRankedJingles: () => get().jingles.filter(j => j.status === 'published' || j.status === 'featured').sort((a, b) => a.rankPosition - b.rankPosition),
  getPendingSuggestions: () => get().suggestions.filter(s => s.status === 'pending'),
}));
