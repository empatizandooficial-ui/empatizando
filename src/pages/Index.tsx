import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";

const Pillars = lazy(() => import("@/components/Pillars"));
const VideoSection = lazy(() => import("@/components/VideoSection"));
const Community = lazy(() => import("@/components/Community"));
const Newsletter = lazy(() => import("@/components/Newsletter"));
const Footer = lazy(() => import("@/components/Footer"));

import { FloatingChat } from "@/components/FloatingChat";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <Suspense fallback={null}>
          <Pillars />
          <VideoSection />
          <Community />
          <Newsletter />
        </Suspense>
      </main>
      <FloatingChat />
      <Suspense fallback={null}>
        <Footer />
      </Suspense>
    </div>
  );
};

export default Index;
