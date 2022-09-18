import Link from "next/link";

export default function Home() {
  return (
    <div className="w-full min-h-screen font-sans bg-primaryBg flex items-center justify-center">
      <Link href="/app">
        <a className="relative inline-flex items-center justify-center p-4 px-10 py-2 overflow-hidden font-medium text-secondary transition duration-300 ease-out border-2 border-secondary rounded-full shadow-md group">
          <span className="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-secondary group-hover:translate-x-0 ease">
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
          <span className="absolute flex items-center justify-center w-full h-full text-secondary transition-all duration-300 transform group-hover:translate-x-full ease">
            App
          </span>
          <span className="relative invisible">App</span>
        </a>
      </Link>
    </div>
  );
}
