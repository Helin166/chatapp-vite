const express = require("express");
const router = express.Router();
const Chat = require("../models/Chat");
const Message = require("../models/Message");

// POST /api/chat/findOrCreate
router.post("/findOrCreate", async (req, res) => {
  const { user1, user2 } = req.body;
  console.log("findOrCreate çağrıldı, user1:", user1, "user2:", user2);

  try {
    let chat = await Chat.findOne({
      members: { $all: [user1, user2], $size: 2 },
    });
    console.log("Bulunan chat:", chat);

    if (chat) {
      return res.json(chat);
    }

    chat = new Chat({
      members: [user1, user2],
    });
    console.log("Yeni chat oluşturuluyor:", chat);

    await chat.save();
    console.log("Chat kaydedildi:", chat);

    return res.json(chat);
  } catch (err) {
    console.error("findOrCreate error:", err);
    return res.status(500).json({ error: "Chat bulunamadı veya oluşturulamadı." });
  }
});


// GET /api/chat/:chatId/messages
router.get('/:chatId/messages', async (req, res) => {
  const { chatId } = req.params;

  try {
    const messages = await Message.find({ chatId });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Mesajlar alınamadı' });
  }
});

module.exports = router;
