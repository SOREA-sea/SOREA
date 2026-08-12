import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ClientLandingPage from '../components/ClientLandingPage';

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--color-FondViolet)] text-[#2A2340] font-sans overflow-x-hidden">
      <Navbar />
      <ClientLandingPage/>
      <Footer />
    </div>
  );
}

