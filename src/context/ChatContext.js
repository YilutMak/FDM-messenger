import { useState, createContext, useContext, useEffect } from "react";
import io from "socket.io-client";

const chatContext = createContext();

export function ChatProvider({ children }) {
  const [message, setMessage] = useState("");
  const [chatLog, setChatLog] = useState([]);
  const [currentActiveChat, setCurrentActiveChat] = useState(null);
  const [socket, setSocket] = useState(null);

  const connectPersonalChannel = (user) => {
    //console.log("User.user:",user)
    if (!socket) {
      const { user_id, firstname, lastname, username } = user;

      const newSocket = io("http://localhost:8000", {
        query: {
          userId: user_id,
          userName: username,
          firstname: firstname,
          lastname: lastname,
        },
      });

      newSocket.on("connect", () => {
        console.log("User_id:", user_id, " connected to Socket");
      });

      //console.log("Connected to personal channel");
      setSocket(newSocket);
    }
  };

  const connectToChatRoom = (roomId, UserId) => {
    joinChatRoom("joinRoom", roomId, UserId); // Join the chat room when connected
    console.log("Connected to channel:", roomId);
  };

  useEffect(() => {
    if (!socket) return; // Check if socket is null

    const handleChatMessage = (data) => {
      console.log("recieved message:", data);

      const { roomId, sender, message, sentTime } = data;

      try {
        const mappedObject = {
          message_id: null,
          chat_id: roomId,
          sender_participant_id: sender,
          text: message,
          time: sentTime,
        };
        setChatLog((prevChatLog) => [...prevChatLog, mappedObject]);
      } catch (error) {
        console.log("Received non-JSON message:", data);
      }
    };

    socket.on("chat message", handleChatMessage);

    // Clean up event listeners when component unmounts or socket changes
    return () => {
      console.log("Socket is unmounted"); // Log when the socket is unmounted
      socket.off("chat message", handleChatMessage);
    };
  }, [socket]);

  const joinChatRoom = (joinroom, room, userId) => {
    if (socket) {
      socket.emit(joinroom, room, userId);
    }
  };

  const sendMessage = (room, userId) => {
    //console.log('socket:', socket, ' message:', message);
    if (socket && socket.connected && message.trim() !== "") {
      console.log("send");
      const currentTime = Date.now(); // Get current local time
      const data = {
        roomId: room,
        sender: userId,
        message: message.trim(),
        sentTime: currentTime,
      };
      socket.emit("chat message", data);
      setMessage("");
    }
  };

  const changeCurrentActiveChat = (chatId) => {
    console.log("current active chat:", chatId);
    setCurrentActiveChat(chatId);
  };

  const recieveChatlog = (chatlog) => {
    setChatLog(chatlog);
  };

  const contextData = {
    socket,
    connectPersonalChannel,
    connectToChatRoom,
    message,
    setMessage,
    chatLog,
    sendMessage,
    joinChatRoom,
    currentActiveChat,
    changeCurrentActiveChat,
    recieveChatlog,
  };
  return (
    <chatContext.Provider value={contextData}>{children}</chatContext.Provider>
  );
}

export function useChat() {
  return useContext(chatContext);
}
