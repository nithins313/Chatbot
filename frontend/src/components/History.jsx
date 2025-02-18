import React from "react";
import HistoryCard from "./Historycard.jsx";
import { useNavigate } from "react-router-dom";

const History = ({ sessions, onSessionClick, selectedSession }) => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const response = await fetch("/api/user/deauth", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Token verification failed");
      }
    } catch (error) {
      console.error("Token verification error:", error);
      navigate("/");
    }
    navigate("/");
  };

  return (
    <div className="w-[20%] bg-black text-white py-2">
      <div className="flex justify-center items-center mx-auto mb-10">
        CHATBOT
      </div>
      {sessions.length > 0 ? (
        sessions.map((session) => (
          <HistoryCard
            key={session.sessionid}
            session={session}
            onClick={() => onSessionClick(session)}
            isSelected={selectedSession?.sessionid === session.sessionid}
          />
        ))
      ) : (
        <div className="text-center text-gray-400">No sessions found</div>
      )}

      <div
        className="fixed justify-center ml-20 bottom-0 p-5  w-full cursor-pointer"
        onClick={logout}
      >
        logout
      </div>
    </div>
  );
};

export default History;
