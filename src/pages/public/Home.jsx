import React, { useState } from "react";
import HomeHero from "./HomeHero";
import Footer from "../../components/layout/public/Footer";
import WelcomeModal, { hasSelectedLanguage } from "../../components/common/WelcomeModal";
import { usePublicStore } from "../../store/usePublicStore";

export default function Home() {
  const home = usePublicStore((s) => s.home);
  const hero = home?.hero || null;

  const [showWelcome, setShowWelcome] = useState(
    !hasSelectedLanguage()
  );

  return (
    <>
      {showWelcome && (
        <WelcomeModal onSelect={() => setShowWelcome(false)} />
      )}

      <HomeHero hero={hero} />

      <Footer />
    </>
  );
}