import "../styles/globals.css";
import { MoralisProvider } from "react-moralis";
import Navbar from "../components/Navbar.jsx";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Fusion Finance</title>
        <meta
          name="description"
          content="A decentralized DeFi protocol for lending and borrowing"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <MoralisProvider initializeOnMount={false}>
        <Navbar />
        <Component {...pageProps} />
      </MoralisProvider>
    </>
  );
}

export default MyApp;
