import Header from "@/components/ambassador/Header";
import Bubble from "@/components/ambassador/Bubble";
import Timeline from "@/components/ambassador/Timeline";
import Footer from "@/components/Footer";
import "./ambassador.css";

export default function Ambassador() {
  return (
    <>
      <main className="ambassador-main">
        <Header />
        <Bubble />
        <Timeline />
      </main>

      <Footer />
    </>
  );
}