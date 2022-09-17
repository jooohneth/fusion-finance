import React from "react";

const ControlSection = () => {
  return (
    <div className="flex flex-col p-6 bg-gray-900 rounded-lg gap-y-6">
      <button className="py-3.5 rounded-lg w-full border border-primary text-primary text-sm font-semibold">
        Lend
      </button>
      <button className="py-3.5 rounded-lg w-full border border-primary text-primary text-sm font-semibold">
        Borrow
      </button>
      <button className="py-3.5 rounded-lg w-full border border-secondary text-secondary text-sm font-semibold">
        Claim FUSN
      </button>
    </div>
  );
};

export default ControlSection;
