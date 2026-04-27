const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();
const server = http.createServer(app);

// ✅ İzin verilen frontend adresleri
const allowedOrigins = ["http://localhost:5173", "http://localhost:5175"];

// ✅ CORS ayarları
app.use(
  cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true, // cookie / header paylaşımı için
  })
);

app.use(express.json());

// ✅ Route'lar
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// ✅ MongoDB bağlantısı
mongoose
  .connect("mongodb://127.0.0.1:27017/chatapp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });

// ✅ Socket.io ayarları
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  },
});

// ✅ Socket.io bağlantı
io.on("connection", (socket) => {
  console.log("🔌 Bağlantı:", socket.id);

  // Odaya katılma
  socket.on("joinChat", (chatRoomId) => {
    socket.join(chatRoomId);
    console.log(`✅ ${socket.id} odasına katıldı: ${chatRoomId}`);
  });

  // Mesaj gönderme
  socket.on("sendMessage", (message) => {
    const { chatId } = message;
    io.to(chatId).emit("receiveMessage", message);
    console.log("📨 Mesaj gönderildi:", message.text);
  });

  // 🗑️ Mesaj silme
  socket.on("deleteMessage", ({ chatId, messageId }) => {
    io.to(chatId).emit("messageDeleted", messageId);
    console.log(`🗑️ Mesaj silindi -> ${messageId}`);
  });

  // Bağlantı kopunca
  socket.on("disconnect", () => {
    console.log("❌ Bağlantı koptu:", socket.id);
  });
});

// ✅ Sunucuyu başlat
const PORT = 5000;
server.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});
