import HeroSection from "../components/HeroSection.jsx";
import CTA from "../components/CTA.jsx";

import { Gradient } from "../components/Gradient.js";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const gradient = new Gradient();

    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <div className="bg-primaryBg w-full overflow-hidden relative">
      <div className="absolute xl:max-w-[1280px] w-full">
        <HeroSection />
      </div>
      <canvas id="gradient-canvas" data-js-darken-top data-transition-in />
      <div className="bg-primaryBg sm:px-16 px-6flex justify-center items-center">
        <div className="xl:max-w-[1280px] w-full">
          <CTA />
        </div>
      </div>
    </div>
  );
}
