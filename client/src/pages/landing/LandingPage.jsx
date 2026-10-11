import React, { useEffect } from 'react';
import LandingNavbar from './LandingNavbar';
import HeroSection from './HeroSection';
import ProblemSolutionSection from './ProblemSolutionSection';
import ServicesSection from './ServicesSection';
import HowItWorksSection from './HowItWorksSection';
import AudienceSection from './AudienceSection';
import EquipmentShowcaseSection from './EquipmentShowcaseSection';
import TrustTransparencySection from './TrustTransparencySection';
import FAQSection from './FAQSection';
import FinalCtaSection from './FinalCtaSection';
import PublicFooter from './PublicFooter';

export default function LandingPage() {
  useEffect(() => {
    document.title = 'LiftCare Network | Commercial Elevator & Escalator Maintenance Platform';
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-cyan-500 selection:text-slate-950">
      {/* Background blueprint grid overlay */}
      <div className="fixed inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25 pointer-events-none z-0" />

      {/* Public Sticky Navbar */}
      <LandingNavbar />

      {/* Main Informational Sections */}
      <main className="flex-1 relative z-10">
        <HeroSection />
        <ProblemSolutionSection />
        <ServicesSection />
        <HowItWorksSection />
        <AudienceSection />
        <EquipmentShowcaseSection />
        <TrustTransparencySection />
        <FAQSection />
        <FinalCtaSection />
      </main>

      {/* Public Footer */}
      <PublicFooter />
    </div>
  );
}
