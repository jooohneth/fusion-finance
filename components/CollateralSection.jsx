import React from "react";

const CollateralSection = ({ collateralBalance }) => {
  return (
    <div className="p-6 bg-gray-900 rounded-lg">
      <table className="w-full">
        <thead>
          <tr className="text-sm font-semibold text-white">
            <td className="py-4 border-b border-gray-700">Collateral</td>
            <td className="py-4 border-b border-gray-700">
              Amount collateralized
            </td>
            <td className="py-4 border-b border-gray-700 text-center">
              Action
            </td>
          </tr>
        </thead>
        <tbody>
          <tr className="text-sm text-gray-500">
            <td className="py-4">
              <div className="flex gap-4 items-center">
                <span className="font-bold text-md"> Ethereum </span>
              </div>
            </td>
            <td className="py-4">{collateralBalance} Ξ</td>
            <td className="py-4 flex justify-center">
              <button className="flex justify-center py-3 mx-1 rounded-full w-12 border-2 border-secondary text-secondary text-sm font-bold">
                +
              </button>
              <button className="flex justify-center py-3 mx-1 rounded-full w-12 border-2 border-primary text-primary text-sm font-bold">
                -
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default CollateralSection;
