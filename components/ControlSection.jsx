import { Fragment, useState } from "react";
import Modal from "./Modal.jsx";

const ControlSection = () => {
  const [showLend, setShowLend] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);
  const [showRepay, setShowRepay] = useState(false);

  return (
    <Fragment>
      <div className="flex flex-col p-6 bg-gray-900 rounded-lg gap-y-6">
        <button
          onClick={() => {
            setShowLend(true);
          }}
          className="py-3.5 rounded-lg w-full border border-secondary text-secondary text-sm font-semibold"
        >
          Lend
        </button>
        <button
          onClick={() => {
            setShowWithdraw(true);
          }}
          className="py-3.5 rounded-lg w-full border border-primary text-primary text-sm font-semibold"
        >
          Withdraw
        </button>
        <button
          onClick={() => {
            setShowBorrow(true);
          }}
          className="py-3.5 rounded-lg w-full border border-secondary text-secondary text-sm font-semibold"
        >
          Borrow
        </button>
        <button
          onClick={() => {
            setShowRepay(true);
          }}
          className="py-3.5 rounded-lg w-full border border-primary text-primary text-sm font-semibold"
        >
          Repay
        </button>
        <button className="py-3.5 rounded-lg w-full bg-secondary text-white text-sm font-semibold">
          Claim FUSN
        </button>
      </div>
      <Modal
        isVisible={showLend}
        onClose={() => {
          setShowLend(false);
        }}
      >
        <div className="p-6 flex items-center justify-center font-semibold text-xl">
          <div>Lend DAI</div>
        </div>
        <div className="bg-gray-700 my-3 rounded-md px-6 py-4 text-xl flex justify-between">
          <input
            type="text"
            className="bg-transparent placeholder:text-gray-400 outline-none w-full text-xl"
            placeholder="0.00"
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold">
            Lend
          </button>
        </div>
      </Modal>
      <Modal
        isVisible={showWithdraw}
        onClose={() => {
          setShowWithdraw(false);
        }}
      >
        <div className="p-6 flex items-center justify-center font-semibold text-xl">
          <div>Withdraw DAI</div>
        </div>
        <div className="bg-gray-700 my-3 rounded-md px-6 py-4 text-xl flex justify-between">
          <input
            type="text"
            className="bg-transparent placeholder:text-gray-400 outline-none w-full text-xl"
            placeholder="0.00"
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold">
            Withdraw
          </button>
        </div>
      </Modal>
      <Modal
        isVisible={showBorrow}
        onClose={() => {
          setShowBorrow(false);
        }}
      >
        <div className="p-6 flex items-center justify-center font-semibold text-xl">
          <div>Borrow DAI</div>
        </div>
        <div className="bg-gray-700 my-3 rounded-md px-6 py-4 text-xl flex justify-between">
          <input
            type="text"
            className="bg-transparent placeholder:text-gray-400 outline-none w-full text-xl"
            placeholder="0.00"
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold">
            Borrow
          </button>
        </div>
      </Modal>
      <Modal
        isVisible={showRepay}
        onClose={() => {
          setShowRepay(false);
        }}
      >
        <div className="p-6 flex items-center justify-center font-semibold text-xl">
          <div>Repay DAI</div>
        </div>
        <div className="bg-gray-700 my-3 rounded-md px-6 py-4 text-xl flex justify-between">
          <input
            type="text"
            className="bg-transparent placeholder:text-gray-400 outline-none w-full text-xl"
            placeholder="0.00"
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold">
            Repay
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default ControlSection;
