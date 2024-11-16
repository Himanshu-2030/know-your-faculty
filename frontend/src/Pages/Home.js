import React, { useState } from "react";
import HeroSection from "../components/HeroSection/HeroSection";

export default function Home() {
  const [language, setLanguage] = useState("en");

  return (
    <div>
      <HeroSection />
    </div>
  );
}
