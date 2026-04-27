import React, { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "./socket";
import Chat from "./pages/Chat";
import AuthForm from "./components/AuthForm";
import UserList from "./pages/UserList"; // 🔹 Artık UserList kullanıyoruz

function App() {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [page, setPage] = useState("auth");

  useEffect(() => {
    const savedEmail = localStorage.getItem("email");
    if (savedEmail) {
      setCurrentUserEmail(savedEmail);
      setPage("users");
    }
  }, []);

  useEffect(() => {
    if (selectedChat?._id) {
      socket.emit("joinChat", selectedChat._id);
    }
  }, [selectedChat]);

  useEffect(() => {
    const handleReceiveMessage = (newMsg) => {
      if (newMsg.chatId === selectedChat?._id) {
        setMessages((prev) => [...prev, newMsg]);
      }
    };

    socket.on("receiveMessage", handleReceiveMessage);
    return () => socket.off("receiveMessage", handleReceiveMessage);
  }, [selectedChat]);

  const startChat = async (otherUserEmail) => {
    if (!otherUserEmail || otherUserEmail === currentUserEmail) return;

    try {
      const res = await axios.post("http://localhost:5000/api/chat/findOrCreate", {
        user1: currentUserEmail,
        user2: otherUserEmail,
      });

      setSelectedChat(res.data);

      const messagesRes = await axios.get(
        `http://localhost:5000/api/chat/${res.data._id}/messages`
      );
      setMessages(messagesRes.data);
      setPage("chat");
    } catch (err) {
      console.error("❌ Sohbet başlatılamadı:", err);
    }
  };

const sendMessage = async () => {
  if (text.trim() === "" || !selectedChat) return;

  const messageToSend = {
    from: currentUserEmail,
    to: selectedChat.members.find((email) => email !== currentUserEmail),
    text: text.trim(),
    chatId: selectedChat._id, // chatId'yi de gönderelim
  };

  try {
    const res = await axios.post("http://localhost:5000/api/messages/send", messageToSend);

    const savedMessage = res.data;

    socket.emit("sendMessage", {
      sender: savedMessage.from,
      text: savedMessage.text,
      chatId: selectedChat._id,
    });

    setText(""); // sadece input'u temizle
  } catch (err) {
    console.error("Mesaj gönderilemedi:", err);
  }
};


  const logout = () => {
    setCurrentUserEmail("");
    localStorage.removeItem("email");
    setSelectedChat(null);
    setMessages([]);
    setPage("auth");
  };

  if (page === "auth") {
    return (
      <>
        <h1 className="text-3xl text-purple-500 text-center font-bold mt-4">
          Giriş / Kayıt
        </h1>
        <AuthForm
          onAuthSuccess={(email) => {
            setCurrentUserEmail(email);
            localStorage.setItem("email", email);
            setPage("users");
          }}
        />
      </>
    );
  } else if (page === "users") {
    return (
      <>
        <h1 className="text-center text-2xl font-bold mt-4">Kullanıcı Listesi</h1>
        <UserList startChat={startChat} logout={logout} /> {/* 🔹 Değiştirildi */}
      </>
    );
  } else if (page === "chat") {
    return (
      <>
        <h1 className="text-center text-2xl font-bold mt-4">Sohbet</h1>
        <Chat
          messages={messages}
          text={text}
          setText={setText}
          sendMessage={sendMessage}
          currentUserEmail={currentUserEmail}
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          logout={logout}
          goBack={() => setPage("users")}
          recipientEmail={selectedChat?.members?.find((e) => e !== currentUserEmail)}
        />
      </>
    );
  }

  return null;
}

export default App;
