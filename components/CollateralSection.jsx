import { Fragment, useState } from "react";
import Modal from "./Modal.jsx";

const CollateralSection = ({ collateralBalance }) => {
  const [showCollateralize, setShowCollateralize] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);

  return (
    <Fragment>
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
                <button
                  className="flex justify-center py-3 mx-1 rounded-full w-12 border-2 border-secondary text-secondary text-sm font-bold"
                  onClick={() => setShowCollateralize(true)}
                >
                  +
                </button>
                <button
                  className="flex justify-center py-3 mx-1 rounded-full w-12 border-2 border-primary text-primary text-sm font-bold"
                  onClick={() => setShowWithdraw(true)}
                >
                  -
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <Modal
        isVisible={showCollateralize}
        onClose={() => setShowCollateralize(false)}
      >
        <div className="p-6 flex items-center justify-center font-semibold text-xl">
          <div>Collateralize ETH</div>
        </div>
        <div className="bg-gray-700 my-3 rounded-md px-6 py-4 text-xl flex justify-between">
          <input
            type="text"
            className="bg-transparent placeholder:text-gray-400 outline-none w-full text-xl"
            placeholder="0.00"
          />
          <div className="text-white">ETH</div>
        </div>
        <div className="p-8">
          <button className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold">
            Collateralize
          </button>
        </div>
      </Modal>
      <Modal isVisible={showWithdraw} onClose={() => setShowWithdraw(false)}>
        <div className="p-6 flex items-center justify-center font-semibold text-xl">
          <div>Withdraw ETH</div>
        </div>
        <div className="bg-gray-700 my-3 rounded-md px-6 py-4 text-xl flex justify-between">
          <input
            type="text"
            className="bg-transparent placeholder:text-gray-400 outline-none w-full text-xl"
            placeholder="0.00"
          />
          <div className="text-white">ETH</div>
        </div>
        <div className="p-8">
          <button className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold">
            Withdraw
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default CollateralSection;
