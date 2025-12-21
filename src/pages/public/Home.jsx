import React, { useEffect } from "react";
import { useCmsStore } from "../../store/useCmsStore";
import HomeHero from "./HomeHero";
import Navbar from "../../components/layout/Navbar";

export default function Home() {
  const fetchPublicHome = useCmsStore((s) => s.fetchPublicHome);
  const hero = useCmsStore((s) => s.hero);

  useEffect(() => {
    fetchPublicHome();
  }, []);

  return (
    <>
      <HomeHero hero={hero} />
    </>
  );
}

