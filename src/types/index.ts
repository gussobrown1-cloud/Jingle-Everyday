export interface Jingle {
  id: string;
  title: string;
  slug: string;
  description: string;
  mediaUrl: string;
  mediaType: 'audio' | 'video' | 'youtube';
  totalRaised: number;
  donationCount: number;
  rankPosition: number;
  status: 'draft' | 'pending' | 'approved' | 'published' | 'featured' | 'archived';
  isFeatured: boolean;
  createdAt: string;
  publishedAt: string;
  todayRaised: number;
  weekRaised: number;
  previousPosition: number | null;
  politician: string; // Ex: "Lula (PT)"
  year: string; // Ex: "1989"
}

export interface Donation {
  id: string;
  jingleId: string;
  amount: number;
  donorName: string | null;
  donorMessage: string | null;
  isAnonymous: boolean;
  paymentStatus: 'pending' | 'processing' | 'confirmed' | 'failed' | 'expired';
  pixCode: string | null;
  paidAt: string | null;
  createdAt: string;
}

export interface Suggestion {
  id: string;
  title: string;
  description: string;
  authorName: string;
  authorEmail: string;
  authorPhone: string;
  status: 'pending' | 'approved' | 'rejected' | 'converted';
  adminNotes: string;
  createdAt: string;
  reviewedAt: string | null;
}

export interface Stats {
  totalRaised: number;
  totalDonations: number;
  totalJingles: number;
  todayRaised: number;
  todayDonations: number;
}

export interface DonationFormData {
  amount: number;
  donorName: string;
  donorMessage: string;
  isAnonymous: boolean;
}

export type Page = 'home' | 'jingle' | 'suggest' | 'rules' | 'transparency' | 'admin';
export type AdminTab = 'dashboard' | 'jingles' | 'suggestions' | 'payments';
export type DonationStep = 'form' | 'pix' | 'confirmed';
