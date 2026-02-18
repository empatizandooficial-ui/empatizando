import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import VideoSection from "@/components/VideoSection";
import Community from "@/components/Community";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Pillars />
        <VideoSection />
        <Community />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
