import React, { useEffect, useState } from "react";
import Message from "./components/Message";
import History from "./components/History";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUser] = useState("");
  const [sessions, setSessions] = useState([]);
  const [selectedSession, setSelectedSession] = useState(null);

  const handleSessionClick = (session) => {
    setSelectedSession(session);
  };

  const ses = async (username) => {
    try {
      const response = await fetch("/api/history/list", {
        method: "POST",
        body: JSON.stringify({ username }),
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch session history");
      }

      const data = await response.json();
      setSessions(data);
      console.log("Session history:", data);
    } catch (error) {
      console.error("Error fetching session history:", error);
    }
  };

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await fetch("/api/user/auth", {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Token verification failed");
        }

        const data = await response.json();
        setUser(data.username); // Set the username in state
        ses(data.username);
      } catch (error) {
        console.error("Token verification error:", error);
        navigate("/");
      }
    };

    verifyToken();
  }, [navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      <History
        sessions={sessions}
        onSessionClick={handleSessionClick}
        selectedSession={selectedSession}
      />
      <Message
        session={selectedSession}
        sessionlist={sessions}
        onSessionClick={handleSessionClick}
        setSessions={setSessions}
        username={username}
      />
    </div>
  );
};

export default Dashboard;
