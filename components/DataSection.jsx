import React from "react";

const DataSection = ({
  daiBalance,
  earnedTokens,
  lendingBalance,
  borrowBalance,
  collateralBalance,
}) => {
  return (
    <div className="flex gap-6">
      <div className="flex flex-row justify-evenly p-4 w-1/2 bg-gray-900 rounded-lg gap-y-3">
        <div className="flex flex-col">
          <div className="flex items-center gap-x-3 gap-y-3">
            <div className="text-xs text-secondary font-medium ">Lending</div>
            <span className="text-xs text-white font-medium">100% APY</span>
          </div>
          <div className="text-xl font-semibold text-white">
            {earnedTokens} FUSN
          </div>
          <div className="text-sm tracking-wide text-gray-500">
            {lendingBalance} DAI
          </div>
        </div>

        <div className="flex flex-col">
          <div className="flex items-center gap-x-3 gap-y-3">
            <div className="text-xs text-primary font-medium ">Borrowing</div>
            <span className="text-xs text-white font-medium">0.3% fee</span>
          </div>
          <div className="text-xl font-semibold text-white">
            {borrowBalance} DAI
          </div>
          <div className="text-sm tracking-wide text-gray-500">
            {collateralBalance} Ξ
          </div>
        </div>
      </div>

      <div className="flex flex-row justify-evenly p-4 w-1/2 bg-gray-900 rounded-lg gap-y-3">
        <div className="flex flex-col justify-around">
          <div className="flex items-center gap-x-3 gap-y-3">
            <div className="text-xs text-secondary font-medium ">
              DAI Wallet Balance
            </div>
          </div>
          <div className="text-xl font-semibold text-white">
            {daiBalance} DAI
          </div>
        </div>
        <div className="flex flex-row justify-around items-center">
          <a className="mx-3 text-primary text-sm font-semibold cursor-pointer underline underline-offset-4">
            Withdraw
          </a>
          <a className="mx-3 text-primary text-sm font-semibold cursor-pointer underline underline-offset-4">
            Repay
          </a>
        </div>
      </div>
    </div>
  );
};

export default DataSection;
