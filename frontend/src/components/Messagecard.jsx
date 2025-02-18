import React from "react";

const MessageCard = ({ message, chatgpt }) => {
  if (!chatgpt) {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-gray-200 p-3 rounded-lg max-w-[70%]">{message}</div>
      </div>
    );
  }
  return (
    <div className="flex mb-4">
      <div className="bg-blue-500 text-white p-3 rounded-lg max-w-[70%]">
        {message}
      </div>
    </div>
  );
};

export default MessageCard;
