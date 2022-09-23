import { Gradient } from "./Gradient.js";

import { useEffect } from "react";

const ErrorSection = ({ x }) => {
  useEffect(() => {
    const gradient = new Gradient();
    gradient.initGradient("#gradient-canvas");
  }, []);

  return (
    <div className="bg-primaryBg w-full overflow-hidden relative min-h-screen">
      <div className="absolute xl:max-w-[1280px] w-full">
        <section className="flex flex-col pt-72 px-10">
          <h1 className="font-bold text-white text-shadow-white text-[42px] leading-[75px]">
            {x ? "Connect Wallet!" : "Wrong Network"}
          </h1>
          {!x && (
            <p className="font-bold text-white text-shadow-white text-[18px] max-w-[470px] mt-5">
              Please, connect to Polygon or Goerli Network!
            </p>
          )}
        </section>
      </div>
      <canvas id="gradient-canvas" data-js-darken-top data-transition-in />
    </div>
  );
};

export default ErrorSection;
