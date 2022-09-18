import React from "react";

const Modal = ({ isVisible, onClose, children }) => {
  if (!isVisible) return null;

  const handleClose = (e) => {
    if (e.target.id === "wrapper") onClose();
  };

  return (
    <div
      id="wrapper"
      className="fixed inset-0 bg-primaryBg bg-opacity-25 backdrop-blur-sm text-white flex justify-center items-center"
      onClick={handleClose}
    >
      <div className="w-[600px] flex flex-col">
        <button
          className="text-xl text-white place-self-end p-2 font-bold"
          onClick={onClose}
        >
          x
        </button>
        <div className="bg-primaryBg p-2 rounded-md border-2 border-primary">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
