import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ClientLandingPage from '../components/ClientLandingPage';

export default function Home() {
  return (
    <div className="min-h-screen bg-[linear-gradient(90deg,#d3cced_0%,#fbf7f2_100%)] text-[#2A2340] font-sans overflow-x-hidden">
      <Navbar />
      <ClientLandingPage />
      <Footer />
    </div>
  );
}
