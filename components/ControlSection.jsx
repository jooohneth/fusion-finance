import { Fragment, useState, useRef } from "react";
import { ethers } from "ethers";
import Modal from "./Modal.jsx";

const ControlSection = ({ coreAddress, coreAbi, daiAddress, daiAbi }) => {
  const [showLend, setShowLend] = useState(false);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [showBorrow, setShowBorrow] = useState(false);
  const [showRepay, setShowRepay] = useState(false);

  const lendAmount = useRef(0);
  const withdrawAmount = useRef(0);
  const borrowAmount = useRef(0);
  const repayAmount = useRef(0);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const coreContract = new ethers.Contract(coreAddress, coreAbi, signer);

  const approve = async (e, tokenAmount) => {
    e.preventDefault();
    try {
      let amount = ethers.utils.parseEther(tokenAmount);
      const daiContract = new ethers.Contract(daiAddress, daiAbi, signer);
      await daiContract.approve(coreAddress, amount);
    } catch (err) {
      console.log(err.error.message);
    }
    setShowLend(false);
  };

  const lend = async (e) => {
    e.preventDefault();
    try {
      let amount = ethers.utils.parseEther(lendAmount.current.value);
      await coreContract.lend(amount);
    } catch (err) {
      console.log(err.error.message);
    }
    setShowLend(false);
  };

  const withdraw = async (e) => {
    e.preventDefault();
    try {
      let amount = ethers.utils.parseEther(withdrawAmount.current.value);
      await coreContract.withdrawLend(amount);
    } catch (err) {
      console.log(err.error.message);
    }
    setShowWithdraw(false);
  };

  const borrow = async (e) => {
    e.preventDefault();
    try {
      let amount = ethers.utils.parseEther(borrowAmount.current.value);
      await coreContract.borrow(amount);
    } catch (err) {
      console.log(err.error.message);
    }
    setShowBorrow(false);
  };

  const repay = async (e) => {
    e.preventDefault();
    try {
      let amount = ethers.utils.parseEther(repayAmount.current.value);
      await coreContract.repay(amount);
    } catch (err) {
      console.log(err.error.message);
    }
    setShowRepay(false);
  };

  const claimTokens = async (e) => {
    e.preventDefault();
    try {
      await coreContract.claimYield();
    } catch (err) {
      console.log(err.error.message);
    }
  };

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
        <button
          onClick={claimTokens}
          className="py-3.5 rounded-lg w-full bg-secondary text-white text-sm font-semibold"
        >
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
            ref={lendAmount}
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button
            onClick={(event) => {
              approve(event, lendAmount.current.value);
            }}
            className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold"
          >
            Approve
          </button>
          <button
            onClick={lend}
            className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold"
          >
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
            ref={withdrawAmount}
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button
            onClick={withdraw}
            className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold"
          >
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
            ref={borrowAmount}
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button
            onClick={borrow}
            className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold"
          >
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
            ref={repayAmount}
          />
          <div className="text-white">DAI</div>
        </div>
        <div className="p-8">
          <button
            onClick={(event) => {
              approve(event, repayAmount.current.value);
            }}
            className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold"
          >
            Approve
          </button>
          <button
            onClick={repay}
            className="py-3.5 rounded-lg w-full border border-secondary hover:bg-secondary text-secondary hover:text-white  text-sm font-semibold"
          >
            Repay
          </button>
        </div>
      </Modal>
    </Fragment>
  );
};

export default ControlSection;
