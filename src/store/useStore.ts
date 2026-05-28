import { create } from 'zustand';
import type { Jingle, Donation, Suggestion, Stats, DonationFormData, Page, AdminTab, DonationStep } from '../types';
import { mockJingles, mockDonations, mockSuggestions, mockStats } from '../data/mockData';
import { supabase } from '../utils/supabaseClient';

const hasSupabase = Boolean(
  import.meta.env.VITE_SUPABASE_URL && 
  import.meta.env.VITE_SUPABASE_ANON_KEY &&
  !import.meta.env.VITE_SUPABASE_URL.includes('SUA_URL_DO_SUPABASE')
);

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

function mapJingleDbToTs(db: any): Jingle {
  return {
    id: db.id,
    title: db.title,
    slug: db.slug,
    description: db.description || '',
    mediaUrl: db.media_url || '',
    mediaType: db.media_type || 'audio',
    totalRaised: Number(db.total_raised || 0),
    donationCount: Number(db.donation_count || 0),
    rankPosition: Number(db.rank_position || 0),
    status: db.status || 'published',
    isFeatured: Boolean(db.is_featured),
    createdAt: db.created_at,
    publishedAt: db.published_at || db.created_at,
    todayRaised: Number(db.today_raised || 0),
    weekRaised: Number(db.week_raised || 0),
    previousPosition: db.previous_position ? Number(db.previous_position) : null,
    politician: db.politician,
    year: db.year,
  };
}

function mapDonationDbToTs(db: any): Donation {
  return {
    id: db.id,
    jingleId: db.jingle_id,
    amount: Number(db.amount),
    donorName: db.donor_name || null,
    donorMessage: db.donor_message || null,
    isAnonymous: Boolean(db.is_anonymous),
    paymentStatus: db.payment_status || 'pending',
    pixCode: db.pix_code || null,
    paidAt: db.paid_at || null,
    createdAt: db.created_at,
  };
}

function mapSuggestionDbToTs(db: any): Suggestion {
  return {
    id: db.id,
    title: db.title,
    description: db.description,
    authorName: db.author_name,
    authorEmail: db.author_email || '',
    authorPhone: db.author_phone || '',
    status: db.status || 'pending',
    adminNotes: db.admin_notes || '',
    createdAt: db.created_at,
    reviewedAt: db.reviewed_at || null,
  };
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

  initializeStore: () => Promise<void>;
  recalculateStats: () => void;
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

  initializeStore: async () => {
    if (!hasSupabase) {
      console.log('Using mockup data (Supabase variables not configured).');
      return;
    }

    // 1. Fetch initial jingles
    const { data: dbJingles, error: jinglesErr } = await supabase
      .from('jingles')
      .select('*');
    
    if (jinglesErr) {
      console.error('Error fetching jingles:', jinglesErr);
    } else if (dbJingles) {
      set({ jingles: dbJingles.map(mapJingleDbToTs) });
    }

    // 2. Fetch initial donations
    const { data: dbDonations, error: donationsErr } = await supabase
      .from('donations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (donationsErr) {
      console.error('Error fetching donations:', donationsErr);
    } else if (dbDonations) {
      set({ donations: dbDonations.map(mapDonationDbToTs) });
    }

    // 3. Fetch initial suggestions
    const { data: dbSuggestions, error: suggestionsErr } = await supabase
      .from('suggestions')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (suggestionsErr) {
      console.error('Error fetching suggestions:', suggestionsErr);
    } else if (dbSuggestions) {
      set({ suggestions: dbSuggestions.map(mapSuggestionDbToTs) });
    }

    // Calculate initial stats
    get().recalculateStats();

    // 4. Subscribe to realtime updates
    supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'jingles' },
        (payload) => {
          const { jingles } = get();
          if (payload.eventType === 'INSERT') {
            set({ jingles: [...jingles, mapJingleDbToTs(payload.new)].sort((a, b) => a.rankPosition - b.rankPosition) });
          } else if (payload.eventType === 'UPDATE') {
            const updated = jingles.map(j => j.id === payload.new.id ? mapJingleDbToTs(payload.new) : j);
            set({ jingles: updated.sort((a, b) => a.rankPosition - b.rankPosition) });
          } else if (payload.eventType === 'DELETE') {
            set({ jingles: jingles.filter(j => j.id !== payload.old.id) });
          }
          get().recalculateStats();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'donations' },
        (payload) => {
          const { donations } = get();
          if (payload.eventType === 'INSERT') {
            set({ donations: [mapDonationDbToTs(payload.new), ...donations] });
          } else if (payload.eventType === 'UPDATE') {
            set({ donations: donations.map(d => d.id === payload.new.id ? mapDonationDbToTs(payload.new) : d) });
          } else if (payload.eventType === 'DELETE') {
            set({ donations: donations.filter(d => d.id !== payload.old.id) });
          }
          get().recalculateStats();
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'suggestions' },
        (payload) => {
          const { suggestions } = get();
          if (payload.eventType === 'INSERT') {
            set({ suggestions: [mapSuggestionDbToTs(payload.new), ...suggestions] });
          } else if (payload.eventType === 'UPDATE') {
            set({ suggestions: suggestions.map(s => s.id === payload.new.id ? mapSuggestionDbToTs(payload.new) : s) });
          } else if (payload.eventType === 'DELETE') {
            set({ suggestions: suggestions.filter(s => s.id !== payload.old.id) });
          }
        }
      )
      .subscribe();
  },

  recalculateStats: () => {
    const { jingles, donations } = get();
    
    const confirmedDonations = donations.filter(d => d.paymentStatus === 'confirmed');
    const totalRaised = confirmedDonations.reduce((acc, d) => acc + d.amount, 0);
    const totalDonations = confirmedDonations.length;
    const totalJingles = jingles.filter(j => j.status === 'published' || j.status === 'featured').length;

    const todayStr = new Date().toDateString();
    const todayDonationsList = confirmedDonations.filter(d => {
      const dateStr = d.paidAt || d.createdAt;
      return dateStr && new Date(dateStr).toDateString() === todayStr;
    });
    const todayRaised = todayDonationsList.reduce((acc, d) => acc + d.amount, 0);
    const todayDonations = todayDonationsList.length;

    set({
      stats: {
        totalRaised,
        totalDonations,
        totalJingles,
        todayRaised,
        todayDonations
      }
    });
  },

  navigate: (page: Page) => set({ page, selectedJingleId: null }),

  openJingle: (id: string) => set({ page: 'jingle', selectedJingleId: id }),

  openDonation: (jingleId: string) => set({ showDonation: true, donationStep: 'form', activeDonation: null, selectedJingleId: jingleId }),

  closeDonation: () => set({ showDonation: false, donationStep: 'form', activeDonation: null }),

  submitDonation: async (jingleId: string, form: DonationFormData) => {
    const amount = form.amount;
    const donorName = form.isAnonymous ? null : (form.donorName || null);
    const donorMessage = form.donorMessage || null;
    const isAnonymous = form.isAnonymous;
    const pixCode = '00020126580014br.gov.bcb.pix0136a629532e-7693-4846-835d-02f863ad91150520400005303986540' + amount.toFixed(2).replace('.', '') + '5802BR5925TODO DIA UM JINGLE6009SAO PAULO62070503***63041D3D';

    if (!hasSupabase) {
      // Mock logic
      const d: Donation = {
        id: `d_${Date.now()}`,
        jingleId,
        amount,
        donorName,
        donorMessage,
        isAnonymous,
        paymentStatus: 'pending',
        pixCode,
        paidAt: null,
        createdAt: new Date().toISOString(),
      };
      set({ donations: [d, ...get().donations], activeDonation: d, donationStep: 'pix' });
      return;
    }

    // Supabase logic
    const { data, error } = await supabase
      .from('donations')
      .insert({
        jingle_id: jingleId,
        amount,
        donor_name: donorName,
        donor_message: donorMessage,
        is_anonymous: isAnonymous,
        payment_status: 'pending',
        pix_code: pixCode
      })
      .select()
      .single();

    if (error) {
      console.error('Error inserting donation:', error);
      get().toast('Erro ao processar apoio. Tente novamente.', 'error');
      return;
    }

    if (data) {
      const mapped = mapDonationDbToTs(data);
      set({ activeDonation: mapped, donationStep: 'pix' });
    }
  },

  confirmPayment: async () => {
    const { activeDonation, donations, jingles, stats } = get();
    if (!activeDonation) return;

    if (!hasSupabase) {
      // Mock logic
      const updated = donations.map(d =>
        d.id === activeDonation.id ? { ...d, paymentStatus: 'confirmed' as const, paidAt: new Date().toISOString() } : d
      );

      let newJingles = jingles.map(j =>
        j.id === activeDonation.jingleId
          ? { ...j, totalRaised: j.totalRaised + activeDonation.amount, donationCount: j.donationCount + 1, todayRaised: j.todayRaised + activeDonation.amount, weekRaised: j.weekRaised + activeDonation.amount }
          : j
      );

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
      return;
    }

    // Supabase logic
    const { data, error } = await supabase
      .from('donations')
      .update({
        payment_status: 'confirmed',
        paid_at: new Date().toISOString()
      })
      .eq('id', activeDonation.id)
      .select()
      .single();

    if (error) {
      console.error('Error confirming payment:', error);
      get().toast('Erro ao confirmar pagamento.', 'error');
      return;
    }

    if (data) {
      const mapped = mapDonationDbToTs(data);
      set({
        donationStep: 'confirmed',
        activeDonation: mapped,
      });

      // Quick visual notification
      const jingle = get().jingles.find(j => j.id === activeDonation.jingleId);
      get().toast(`Apoio confirmado para ${jingle?.title || 'Jingle'}!`, 'success');
    }
  },

  submitSuggestion: async (data) => {
    if (!hasSupabase) {
      // Mock logic
      const s: Suggestion = { id: `s_${Date.now()}`, ...data, status: 'pending', adminNotes: '', createdAt: new Date().toISOString(), reviewedAt: null };
      set({ suggestions: [s, ...get().suggestions] });
      get().toast('Sugestão enviada com sucesso!', 'success');
      return;
    }

    // Supabase logic
    const { error } = await supabase
      .from('suggestions')
      .insert({
        title: data.title,
        description: data.description,
        author_name: data.authorName,
        author_email: data.authorEmail,
        author_phone: data.authorPhone,
        status: 'pending'
      });

    if (error) {
      console.error('Error submitting suggestion:', error);
      get().toast('Erro ao enviar sugestão. Tente novamente.', 'error');
    } else {
      get().toast('Sugestão enviada com sucesso!', 'success');
    }
  },

  approveSuggestion: async (id: string) => {
    if (!hasSupabase) {
      set({ suggestions: get().suggestions.map(s => s.id === id ? { ...s, status: 'approved' as const, reviewedAt: new Date().toISOString() } : s) });
      return;
    }

    const { error } = await supabase
      .from('suggestions')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error approving suggestion:', error);
      get().toast('Erro ao aprovar sugestão.', 'error');
    }
  },

  rejectSuggestion: async (id: string) => {
    if (!hasSupabase) {
      set({ suggestions: get().suggestions.map(s => s.id === id ? { ...s, status: 'rejected' as const, reviewedAt: new Date().toISOString() } : s) });
      return;
    }

    const { error } = await supabase
      .from('suggestions')
      .update({
        status: 'rejected',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      console.error('Error rejecting suggestion:', error);
      get().toast('Erro ao rejeitar sugestão.', 'error');
    }
  },

  toggleFeature: async (id: string) => {
    if (!hasSupabase) {
      set({ jingles: get().jingles.map(j => j.id === id ? { ...j, isFeatured: !j.isFeatured, status: (!j.isFeatured ? 'featured' : 'published') as Jingle['status'] } : j) });
      return;
    }

    const jingle = get().jingles.find(j => j.id === id);
    if (!jingle) return;

    const newFeatured = !jingle.isFeatured;
    const newStatus = newFeatured ? 'featured' : 'published';

    const { error } = await supabase
      .from('jingles')
      .update({
        is_featured: newFeatured,
        status: newStatus
      })
      .eq('id', id);

    if (error) {
      console.error('Error toggling feature status:', error);
      get().toast('Erro ao alterar destaque.', 'error');
    }
  },

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
