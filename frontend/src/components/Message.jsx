import React, { useEffect, useState } from "react";
import MessageCard from "./Messagecard";

const Message = ({
  session,
  username,
  onSessionClick,
  setSessions,
  sessionlist,
}) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    if (!session) return;
    const sessionid = session.sessionid;
    const username = session.username;

    const fetchMessages = async () => {
      try {
        const response = await fetch(`/api/history/message`, {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({ sessionid, username }),
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          setMessages(data.interactions || []);
        } else {
          throw new Error("Failed to fetch messages");
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
  }, [session]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      const response = await fetch(`/api/gen/interact`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          sessionid: session.sessionid,
          username: session.username,
          prompt: newMessage,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedMessages = [
          ...messages,
          { prompt: newMessage, reply: data.reply },
        ];
        setMessages(updatedMessages);

        setNewMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleCreateSession = async () => {
    try {
      const response = await fetch(`/api/gen/interact`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          username: username,
          prompt: newMessage,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const updatedMessages = [
          ...messages,
          { prompt: newMessage, reply: data.reply },
        ];

        const updatesession = [
          ...sessionlist,
          {
            sessionid: data.sessionid,
            username,
            sessionname: data.sessionname,
          },
        ];
        setNewMessage(updatesession);
        onSessionClick({
          sessionid: data.sessionid,
          username,
          sessionname: data.sessionname,
        });
        setMessages(updatedMessages);
        setNewMessage("");
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  if (!session) {
    return (
      <div>
        <div className="flex justify-center items-center w-full">
          <p>Select a session or create a new one</p>
        </div>
        <div className="fixed bottom-0 left-[20%] w-[80%] bg-white border-t flex items-center">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none"
          />
          <button
            onClick={handleCreateSession}
            className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed flex flex-col w-[80%] my-0 mr-0 m-auto right-0 h-full bg-gray-100">
      <div className="flex-1 p-4 overflow-y-auto" id="message-container">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div key={index}>
              <MessageCard message={message.prompt} />
              <MessageCard message={message.reply} chatgpt={true} />
            </div>
          ))
        ) : (
          <p>No messages found in this session</p>
        )}
      </div>
      <div className="fixed bottom-0 left-[20%] w-[80%] bg-white border-t flex items-center">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 outline-none"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Message;
