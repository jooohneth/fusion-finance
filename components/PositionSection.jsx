import React from "react";

const PositionSection = () => {
  return (
    <div className="flex flex-col p-6 bg-gray-900 rounded-lg gap-y-6">
      <hr className="border-secondary" />
      <div className="flex gap-x-7">
        <div className="flex flex-col gap-y-4">
          <div className="flex gap-x-2 items-start">
            <div className="text-sm font-medium text-white">Borrow Limit: </div>
            <div className="text-sm font-medium text-primary">567.00 DAI</div>
          </div>
          <div className="flex gap-x-2 items-start">
            <div className="text-sm font-medium text-white">
              Liquidation Point:{" "}
            </div>
            <div className="text-sm font-medium text-primary">400.00</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionSection;
