import { Jingle, Donation, Suggestion, Stats } from '../types';

export const mockJingles: Jingle[] = [
  { id: '1', title: 'Lula lá', slug: 'lula-la', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 4580.00, donationCount: 312, rankPosition: 1, status: 'featured', isFeatured: true, createdAt: '2024-01-01T10:00:00Z', publishedAt: '2024-01-01T12:00:00Z', todayRaised: 420, weekRaised: 1200, previousPosition: 1, politician: 'Lula (PT)', year: '1989' },
  { id: '2', title: 'Brilha uma satisfação', slug: 'brilha-uma-estrela', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 3890.00, donationCount: 245, rankPosition: 2, status: 'published', isFeatured: false, createdAt: '2024-01-02T10:00:00Z', publishedAt: '2024-01-02T12:00:00Z', todayRaised: 280, weekRaised: 890, previousPosition: 3, politician: 'Collor (PRN)', year: '1989' },
  { id: '3', title: 'Muda Brasil', slug: 'muda-brasil', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 3450.00, donationCount: 198, rankPosition: 3, status: 'published', isFeatured: false, createdAt: '2024-01-03T10:00:00Z', publishedAt: '2024-01-03T12:00:00Z', todayRaised: 150, weekRaised: 650, previousPosition: 2, politician: 'Tancredo Neves (PMDB)', year: '1985' },
  { id: '4', title: 'Levanta a mão', slug: 'levanta-a-mao', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 2980.00, donationCount: 167, rankPosition: 4, status: 'published', isFeatured: false, createdAt: '2024-01-04T10:00:00Z', publishedAt: '2024-01-04T12:00:00Z', todayRaised: 95, weekRaised: 420, previousPosition: 4, politician: 'Lula (PT)', year: '2002' },
  { id: '5', title: 'Eu sou você amanhã', slug: 'eu-sou-voce-amanha', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 2750.00, donationCount: 156, rankPosition: 5, status: 'published', isFeatured: false, createdAt: '2024-01-05T10:00:00Z', publishedAt: '2024-01-05T12:00:00Z', todayRaised: 85, weekRaised: 380, previousPosition: 6, politician: 'Maluf (PDS)', year: '1984' },
  { id: '6', title: 'Varre varre vassourinha', slug: 'varre-varre-vassourinha', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 2340.00, donationCount: 134, rankPosition: 6, status: 'published', isFeatured: false, createdAt: '2024-01-06T10:00:00Z', publishedAt: '2024-01-06T12:00:00Z', todayRaised: 60, weekRaised: 290, previousPosition: 5, politician: 'Jânio Quadros (PTN)', year: '1960' },
  { id: '7', title: 'Rouba mas faz', slug: 'rouba-mas-faz', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 2100.00, donationCount: 118, rankPosition: 7, status: 'published', isFeatured: false, createdAt: '2024-01-07T10:00:00Z', publishedAt: '2024-01-07T12:00:00Z', todayRaised: 45, weekRaised: 210, previousPosition: 7, politician: 'Ademar de Barros (PSP)', year: '1962' },
  { id: '8', title: 'É o Aécio', slug: 'e-o-aecio', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1890.00, donationCount: 102, rankPosition: 8, status: 'published', isFeatured: false, createdAt: '2024-01-08T10:00:00Z', publishedAt: '2024-01-08T12:00:00Z', todayRaised: 35, weekRaised: 180, previousPosition: 9, politician: 'Aécio Neves (PSDB)', year: '2014' },
  { id: '9', title: 'Dilma coração valente', slug: 'dilma-coracao-valente', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1750.00, donationCount: 95, rankPosition: 9, status: 'published', isFeatured: false, createdAt: '2024-01-09T10:00:00Z', publishedAt: '2024-01-09T12:00:00Z', todayRaised: 40, weekRaised: 160, previousPosition: 8, politician: 'Dilma (PT)', year: '2010' },
  { id: '10', title: 'Olê olê olê olá, Lula', slug: 'ole-ole-lula', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1620.00, donationCount: 89, rankPosition: 10, status: 'published', isFeatured: false, createdAt: '2024-01-10T10:00:00Z', publishedAt: '2024-01-10T12:00:00Z', todayRaised: 30, weekRaised: 140, previousPosition: 10, politician: 'Lula (PT)', year: '2006' },
  { id: '11', title: 'Serra é o Brasil', slug: 'serra-e-o-brasil', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1480.00, donationCount: 78, rankPosition: 11, status: 'published', isFeatured: false, createdAt: '2024-01-11T10:00:00Z', publishedAt: '2024-01-11T12:00:00Z', todayRaised: 25, weekRaised: 120, previousPosition: 12, politician: 'José Serra (PSDB)', year: '2010' },
  { id: '12', title: 'FHC isso aqui vai virar', slug: 'fhc-isso-vai-virar', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1350.00, donationCount: 72, rankPosition: 12, status: 'published', isFeatured: false, createdAt: '2024-01-12T10:00:00Z', publishedAt: '2024-01-12T12:00:00Z', todayRaised: 20, weekRaised: 95, previousPosition: 11, politician: 'FHC (PSDB)', year: '1994' },
  { id: '13', title: 'Meu Brasil brasileiro', slug: 'meu-brasil-brasileiro', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1200.00, donationCount: 65, rankPosition: 13, status: 'published', isFeatured: false, createdAt: '2024-01-13T10:00:00Z', publishedAt: '2024-01-13T12:00:00Z', todayRaised: 18, weekRaised: 85, previousPosition: 13, politician: 'Getúlio Vargas', year: '1950' },
  { id: '14', title: 'Jingle do JK', slug: 'jingle-jk', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 1080.00, donationCount: 58, rankPosition: 14, status: 'published', isFeatured: false, createdAt: '2024-01-14T10:00:00Z', publishedAt: '2024-01-14T12:00:00Z', todayRaised: 15, weekRaised: 70, previousPosition: 15, politician: 'Juscelino Kubitschek (PSD)', year: '1955' },
  { id: '15', title: 'Marina Silva', slug: 'marina-silva', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 950.00, donationCount: 52, rankPosition: 15, status: 'published', isFeatured: false, createdAt: '2024-01-15T10:00:00Z', publishedAt: '2024-01-15T12:00:00Z', todayRaised: 12, weekRaised: 55, previousPosition: 14, politician: 'Marina Silva (PV)', year: '2010' },
  { id: '16', title: 'Bolsonaro Mito', slug: 'bolsonaro-mito', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 890.00, donationCount: 48, rankPosition: 16, status: 'published', isFeatured: false, createdAt: '2024-01-16T10:00:00Z', publishedAt: '2024-01-16T12:00:00Z', todayRaised: 10, weekRaised: 45, previousPosition: 16, politician: 'Bolsonaro (PSL)', year: '2018' },
  { id: '17', title: 'Ciro Gomes 12', slug: 'ciro-gomes-12', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 780.00, donationCount: 42, rankPosition: 17, status: 'published', isFeatured: false, createdAt: '2024-01-17T10:00:00Z', publishedAt: '2024-01-17T12:00:00Z', todayRaised: 8, weekRaised: 38, previousPosition: 18, politician: 'Ciro Gomes (PDT)', year: '2018' },
  { id: '18', title: 'Brizola coração', slug: 'brizola-coracao', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 720.00, donationCount: 38, rankPosition: 18, status: 'published', isFeatured: false, createdAt: '2024-01-18T10:00:00Z', publishedAt: '2024-01-18T12:00:00Z', todayRaised: 6, weekRaised: 32, previousPosition: 17, politician: 'Leonel Brizola (PDT)', year: '1989' },
  { id: '19', title: 'Enéas 56', slug: 'eneas-56', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 650.00, donationCount: 35, rankPosition: 19, status: 'published', isFeatured: false, createdAt: '2024-01-19T10:00:00Z', publishedAt: '2024-01-19T12:00:00Z', todayRaised: 5, weekRaised: 28, previousPosition: 19, politician: 'Enéas Carneiro (PRONA)', year: '1994' },
  { id: '20', title: 'Haddad é Lula', slug: 'haddad-e-lula', description: '', mediaUrl: '', mediaType: 'audio', totalRaised: 580.00, donationCount: 31, rankPosition: 20, status: 'published', isFeatured: false, createdAt: '2024-01-20T10:00:00Z', publishedAt: '2024-01-20T12:00:00Z', todayRaised: 4, weekRaised: 22, previousPosition: 20, politician: 'Haddad (PT)', year: '2018' },
];

export const mockDonations: Donation[] = [
  { id: 'd1', jingleId: '1', amount: 25.00, donorName: 'Maria S.', donorMessage: 'Clássico demais!', isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-15T10:30:00Z', createdAt: '2024-12-15T10:28:00Z' },
  { id: 'd2', jingleId: '1', amount: 10.00, donorName: null, donorMessage: null, isAnonymous: true, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-15T09:15:00Z', createdAt: '2024-12-15T09:12:00Z' },
  { id: 'd3', jingleId: '2', amount: 50.00, donorName: 'Pedro R.', donorMessage: 'Lembro da época!', isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-15T08:45:00Z', createdAt: '2024-12-15T08:40:00Z' },
  { id: 'd4', jingleId: '3', amount: 15.00, donorName: 'Ana C.', donorMessage: 'Histórico!', isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-15T07:30:00Z', createdAt: '2024-12-15T07:25:00Z' },
  { id: 'd5', jingleId: '4', amount: 20.00, donorName: 'Carlos L.', donorMessage: null, isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-14T12:30:00Z', createdAt: '2024-12-14T12:25:00Z' },
  { id: 'd6', jingleId: '6', amount: 100.00, donorName: 'Renata M.', donorMessage: 'O jingle mais icônico!', isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-14T18:00:00Z', createdAt: '2024-12-14T17:55:00Z' },
  { id: 'd7', jingleId: '1', amount: 30.00, donorName: 'Lucas G.', donorMessage: null, isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-14T15:20:00Z', createdAt: '2024-12-14T15:18:00Z' },
  { id: 'd8', jingleId: '5', amount: 15.00, donorName: 'Julia F.', donorMessage: 'Maluf clássico', isAnonymous: false, paymentStatus: 'confirmed', pixCode: null, paidAt: '2024-12-14T14:00:00Z', createdAt: '2024-12-14T13:55:00Z' },
];

export const mockSuggestions: Suggestion[] = [
  { id: 's1', title: 'Jingle do Quércia', description: 'Aquele jingle famoso do Quércia governador de SP.', authorName: 'Fernando O.', authorEmail: 'fernando@email.com', authorPhone: '', status: 'pending', adminNotes: '', createdAt: '2024-12-15T14:00:00Z', reviewedAt: null },
  { id: 's2', title: 'Ulysses Guimarães', description: 'Jingle da campanha do Ulysses em 89.', authorName: 'Roberto P.', authorEmail: 'roberto@email.com', authorPhone: '', status: 'pending', adminNotes: '', createdAt: '2024-12-15T11:00:00Z', reviewedAt: null },
  { id: 's3', title: 'Covas Governador', description: 'Campanha do Mário Covas para governador de SP.', authorName: 'Mariana L.', authorEmail: '', authorPhone: '', status: 'approved', adminNotes: 'Bom jingle, aprovar.', createdAt: '2024-12-14T18:00:00Z', reviewedAt: '2024-12-15T09:00:00Z' },
];

export const mockStats: Stats = {
  totalRaised: 35983.00,
  totalDonations: 1835,
  totalJingles: 20,
  todayRaised: 1178,
  todayDonations: 67
};

export function calculateGapToNext(jingle: Jingle, allJingles: Jingle[]): { targetTitle: string; amount: number } | null {
  const sorted = [...allJingles].sort((a, b) => b.totalRaised - a.totalRaised);
  const idx = sorted.findIndex(j => j.id === jingle.id);
  if (idx <= 0) return null;
  const above = sorted[idx - 1];
  return { targetTitle: above.title, amount: +(above.totalRaised - jingle.totalRaised + 0.01).toFixed(2) };
}

export function formatCurrency(v: number): string {
  return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function formatCompact(v: number): string {
  if (v >= 1000) return `${(v / 1000).toFixed(1).replace('.0', '')}k`;
  return v.toString();
}

export function timeAgo(date: string): string {
  const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (s < 60) return 'agora';
  if (s < 3600) return `${Math.floor(s / 60)}min`;
  if (s < 86400) return `${Math.floor(s / 3600)}h`;
  return `${Math.floor(s / 86400)}d`;
}
