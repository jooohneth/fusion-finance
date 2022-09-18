import { ethers } from "ethers";
import { useState, useEffect } from "react";
import { useMoralis } from "react-moralis";
import {
  fusionCoreAddress,
  fusionCoreAbi,
  fusionTokenAddress,
  fusionTokenAbi,
  daiAddress,
  daiAbi,
} from "../constants";

import DataSection from "../components/DataSection.jsx";
import ControlSection from "../components/ControlSection.jsx";
import CollateralSection from "../components/CollateralSection.jsx";
import PositionSection from "../components/PositionSection.jsx";

export default function App() {
  const [daiBalance, setDaiBalance] = useState(0);
  const [earnedTokens, setEarnedTokens] = useState(0);
  const [lendingBalance, setLendingBalance] = useState(0);
  const [borrowBalance, setBorrowBalance] = useState(0);
  const [collateralBalance, setCollateralBalance] = useState(0);
  const [borrowLimit, setBorrowLimit] = useState(0);
  const [liquidationPoint, setLiquidationPoint] = useState(0);

  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);

  const coreAddress =
    chainId in fusionCoreAddress ? fusionCoreAddress[chainId] : null;
  const tokenAddress =
    chainId in fusionTokenAddress ? fusionTokenAddress[chainId] : null;
  const baseAssetAddress = chainId in daiAddress ? daiAddress[chainId] : null;

  useEffect(() => {
    if (isWeb3Enabled && coreAddress) {
      getDaiBalance();
      getEarnedTokens();
      getLendingBalance();
      getBorrowBalance();
      getCollateralBalance();
      getBorrowLimit();
      getLiquidationPoint();
    }
  }, [isWeb3Enabled, coreAddress]);

  const getDaiBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const daiContract = new ethers.Contract(baseAssetAddress, daiAbi, signer);
    const address = await signer.getAddress();
    const rawBalance = await daiContract.balanceOf(address);
    const balance = Number.parseFloat(
      ethers.utils.formatEther(rawBalance)
    ).toFixed(2);
    setDaiBalance(balance);
  };

  const getEarnedTokens = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const coreContract = new ethers.Contract(
      coreAddress,
      fusionCoreAbi,
      signer
    );
    const address = await signer.getAddress();
    const rawEarnedAmount = await coreContract.getEarnedFusionTokens(address);
    const earnedAmount = Number.parseFloat(
      ethers.utils.formatEther(rawEarnedAmount)
    ).toFixed(2);
    setEarnedTokens(earnedAmount);
  };

  const getLendingBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const coreContract = new ethers.Contract(
      coreAddress,
      fusionCoreAbi,
      signer
    );
    const address = await signer.getAddress();
    const rawAmount = await coreContract.getLendingBalance(address);
    const amount = Number.parseFloat(
      ethers.utils.formatEther(rawAmount)
    ).toFixed(2);
    setLendingBalance(amount);
  };

  const getBorrowBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const coreContract = new ethers.Contract(
      coreAddress,
      fusionCoreAbi,
      signer
    );
    const address = await signer.getAddress();
    const rawAmount = await coreContract.getBorrowBalance(address);
    const amount = Number.parseFloat(
      ethers.utils.formatEther(rawAmount)
    ).toFixed(2);
    setBorrowBalance(amount);
  };

  const getCollateralBalance = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const coreContract = new ethers.Contract(
      coreAddress,
      fusionCoreAbi,
      signer
    );
    const address = await signer.getAddress();
    const rawAmount = await coreContract.getCollateralBalance(address);
    const amount = Number.parseFloat(
      ethers.utils.formatEther(rawAmount)
    ).toFixed(2);
    setCollateralBalance(amount);
  };

  const getBorrowLimit = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const coreContract = new ethers.Contract(
      coreAddress,
      fusionCoreAbi,
      signer
    );
    const address = await signer.getAddress();
    const rawAmount = await coreContract.getBorrowLimit(address);
    const amount = Number.parseFloat(
      ethers.utils.formatEther(rawAmount)
    ).toFixed(2);
    setBorrowLimit(amount);
  };

  const getLiquidationPoint = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const coreContract = new ethers.Contract(
      coreAddress,
      fusionCoreAbi,
      signer
    );
    const address = await signer.getAddress();
    const rawAmount = await coreContract.getLiquidationPoint(address);
    const amount = Number.parseFloat(
      ethers.utils.formatEther(rawAmount)
    ).toFixed(2);
    setLiquidationPoint(amount);
  };

  if (!isWeb3Enabled) {
    return (
      <div className="flex items-start justify-center w-full min-h-screen font-sans bg-primaryBg">
        <h1 className="text-3xl font-semibold text-white">Connect Wallet!</h1>
      </div>
    );
  }

  if (!coreAddress) {
    return (
      <div className="flex items-start justify-center w-full min-h-screen font-sans bg-primaryBg">
        <h1 className="text-3xl font-semibold text-white">
          Please, connect to Goerli Network!
        </h1>
      </div>
    );
  }

  return (
    <div>
      <div className="flex w-full min-h-screen font-sans bg-primaryBg">
        <main className="flex flex-col flex-1 gap-6 p-8">
          <header>
            <h1 className="text-3xl font-semibold text-white">Dashboard</h1>
          </header>
          <hr className="border-secondary" />
          <DataSection
            daiBalance={daiBalance}
            earnedTokens={earnedTokens}
            lendingBalance={lendingBalance}
            borrowBalance={borrowBalance}
            collateralBalance={collateralBalance}
          />
          <CollateralSection collateralBalance={collateralBalance} />
        </main>
        <aside className="flex flex-col gap-y-6 pt-6 pr-6 w-96">
          <ControlSection />
          <PositionSection
            borrowLimit={borrowLimit}
            liquidationPoint={liquidationPoint}
          />
        </aside>
      </div>
    </div>
  );
}
