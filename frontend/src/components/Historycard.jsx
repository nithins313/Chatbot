import React from "react";

const HistoryCard = ({ session, onClick, isSelected }) => {
  return (
    <div
      className={`flex justify-center items-center w-full h-fit overflow-hidden px-5 mx-auto ${
        isSelected ? "bg-gray-500" : "bg-gray-400"
      } m-2 rounded-lg cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex overflow-hidden w-[80%] whitespace-nowrap text-ellipsis">
        {session.sessionname}
      </div>
      <div className="flex justify-end ml-auto cursor-pointer text-red-500 font-bold">
        X
      </div>
    </div>
  );
};

export default HistoryCard;
