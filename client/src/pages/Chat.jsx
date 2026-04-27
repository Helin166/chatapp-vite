import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

function Chat({ goBack, logout, recipientEmail, currentUserEmail }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const chatRoomId = [currentUserEmail, recipientEmail].sort().join("_");

  useEffect(() => {
    if (!recipientEmail || !currentUserEmail) return;

    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/messages/${currentUserEmail}/${recipientEmail}`
        );
        setMessages(res.data);
      } catch (err) {
        console.error("Mesajlar alınamadı:", err);
      }
    };

    fetchMessages();
    socket.emit("joinChat", chatRoomId);
  }, [recipientEmail, currentUserEmail]);

  useEffect(() => {
    const handleReceive = (msg) => {
      if (msg.chatId !== chatRoomId) return;

      setMessages((prev) => {
        if (msg._id && prev.some((m) => m._id === msg._id)) return prev;
        if (
          !msg._id &&
          msg.from &&
          msg.text &&
          msg.createdAt &&
          prev.some(
            (m) =>
              m.from === msg.from &&
              m.text === msg.text &&
              m.createdAt === msg.createdAt
          )
        ) {
          return prev;
        }
        return [...prev, msg];
      });
    };

    socket.on("receiveMessage", handleReceive);
    return () => socket.off("receiveMessage", handleReceive);
  }, [chatRoomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = newMessage.trim();
    if (!trimmed) return;

    const newMsg = {
      from: currentUserEmail,
      to: recipientEmail,
      text: trimmed,
    };

    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        newMsg
      );
      const savedMessage = res.data;

      socket.emit("sendMessage", { ...savedMessage, chatId: chatRoomId });
      setMessages((prev) => [...prev, savedMessage]);
      setNewMessage("");
    } catch (err) {
      console.error("Mesaj gönderilemedi:", err);
    }
  };

  // 📅 Mesajları tarihe göre gruplayalım
  const groupedMessages = [];
  let lastDate = null;

  messages.forEach((msg, index) => {
    const msgDate = new Date(msg.createdAt).toLocaleDateString("tr-TR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    if (msgDate !== lastDate) {
      groupedMessages.push({
        type: "date",
        date: msgDate,
        id: `date-${msgDate}-${index}`,
      });
      lastDate = msgDate;
    }

    groupedMessages.push({ ...msg, type: "message" });
  });

  // 📌 Mesaj silme fonksiyonu
  const handleDelete = async (id) => {
  console.log("Silinecek mesaj id:", id); // <--- bunu ekle
  if (!id) return;
  try {
    await axios.delete(`http://localhost:5000/api/messages/${id}`);
    setMessages((prev) => prev.filter((m) => m._id !== id));
  } catch (err) {
    console.error("Mesaj silinemedi:", err.response?.data || err.message);
  }
};

  return (
    <div className="flex items-center justify-center h-screen bg-black px-4">
      <div className="p-6 w-full max-w-xl bg-gray-900 rounded-lg shadow-lg flex flex-col">
        {/* Üst bar */}
        <div className="flex justify-between items-center mb-4 text-white">
          <h2 className="text-xl font-semibold">
            Sohbet: {recipientEmail || "Bilinmiyor"}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={goBack}
              className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600"
            >
              ← Geri Dön
            </button>
            <button
              onClick={logout}
              className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
            >
              Çıkış Yap
            </button>
          </div>
        </div>

        {/* Mesaj listesi */}
        <div
          className="overflow-y-auto border border-gray-700 rounded-lg p-4 mb-4 bg-black shadow flex flex-col"
          style={{ height: "400px", flexShrink: 0 }}
        >
          {groupedMessages.length === 0 ? (
            <p className="text-center text-gray-400 mt-auto mb-auto">
              Henüz mesaj yok.
            </p>
          ) : (
            groupedMessages.map((item, index) => {
              if (item.type === "date") {
                return (
                  <div
                    key={item.id}
                    className="text-center text-gray-400 text-sm my-2"
                  >
                    {item.date}
                  </div>
                );
              }

              return (
                <div
                  key={item._id ? item._id + "_" + index : index}
                  className={`mb-2 ${
                    item.from === currentUserEmail ? "text-right" : "text-left"
                  }`}
                >
                  <div
                    className={`p-2 rounded inline-block max-w-[70%] break-words relative ${
                      item.from === currentUserEmail
                        ? "bg-purple-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {item.text}

                    {/* ❌ Silme butonu (sadece kendi mesajında) */}
                    {item.from === currentUserEmail && (
                      <button
                        onClick={() => handleDelete(item._id)}
                        className="absolute top-0 right-0 text-xs text-red-400 hover:text-red-600 px-1"
                      >
                        ✖
                      </button>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {item.createdAt
                      ? new Date(item.createdAt).toLocaleTimeString("tr-TR", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : ""}
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Mesaj yazma alanı */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-700 bg-gray-800 text-white rounded p-2"
            placeholder="Mesajınızı yazın..."
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <button
            onClick={handleSend}
            disabled={newMessage.trim() === ""}
            className={`px-4 py-2 rounded text-white ${
              newMessage.trim() === ""
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-purple-600 hover:bg-purple-700"
            }`}
          >
            Gönder
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
