import { useState, useEffect } from "react";
import { ConnectButton } from "web3uikit";
import Link from "next/link";
import { useRouter } from "next/router";
import { ethers } from "ethers";

const Navbar = () => {
  const [pageName, setPageName] = useState("");
  const router = useRouter();

  const [fusionBalance, setFusionBalance] = useState(0);

  useEffect(() => {
    const _pageName = router.pathname;
    setPageName(_pageName);
  }, [router.pathname]);

  useEffect(() => {
    const getFusionBalace = async () => {};
  }, []);

  return (
    <div>
      <nav className="p-2 shadow-md flex flex-row justify-between items-center bg-primaryBg">
        <Link href="/">
          <a className="ml-12 p-4 font-bold text-2xl text-primary">
            Fusion<span className="text-secondary">Finance</span>
          </a>
        </Link>
        {pageName === "/" && (
          <Link href="/app">
            <a className="relative inline-flex items-center justify-center mr-16 p-4 px-10 py-2 overflow-hidden font-medium text-primary transition duration-300 ease-out border-2 border-primary rounded-full shadow-md group">
              <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-primary group-hover:translate-x-0 ease">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  ></path>
                </svg>
              </span>
              <span className="absolute flex items-center justify-center w-full h-full text-primary transition-all duration-300 transform group-hover:translate-x-full ease">
                App
              </span>
              <span className="relative invisible">App</span>
            </a>
          </Link>
        )}
        {pageName === "/app" && (
          <div>
            <div className="mr-16">
              <ConnectButton moralisAuth={false} />
            </div>
          </div>
        )}
      </nav>
      <hr className="border-secondary" />
    </div>
  );
};

export default Navbar;
