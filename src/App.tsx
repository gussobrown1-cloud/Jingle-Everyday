import { useStore } from './store/useStore';
import { Header } from './components/Header';
import { StatsBar } from './components/StatsBar';
import { HeroBanner } from './components/HeroBanner';
import { RankingList } from './components/RankingList';
import { JingleDetail } from './components/JingleDetail';
import { DonationModal } from './components/DonationModal';
import { SuggestForm } from './components/SuggestForm';
import { HowItWorks } from './components/HowItWorks';
import { HowItWorksSection } from './components/HowItWorksSection';
import { AdminPanel } from './components/AdminPanel';
import { Notifications } from './components/Notifications';
import { Footer } from './components/Footer';

export default function App() {
  const { page, selectedJingleId } = useStore();

  if (page === 'admin') return <><AdminPanel /><Notifications /></>;
  if (page === 'jingle' && selectedJingleId) return <><JingleDetail /><DonationModal /><Notifications /></>;
  if (page === 'suggest') return <><SuggestForm /><Notifications /></>;
  if (page === 'rules') return <><HowItWorks /><Notifications /></>;

  return (
    <div className="min-h-screen bg-surface-50 flex flex-col">
      <Header />
      <StatsBar />
      <main className="flex-1">
        <HeroBanner />
        <RankingList />
        <HowItWorksSection />
      </main>
      <Footer />
      <DonationModal />
      <Notifications />
    </div>
  );
}
