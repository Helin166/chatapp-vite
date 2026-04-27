const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// ❌ Mesaj silme (EN ÖNCE)
router.delete("/:id", async (req, res) => {
  try {
    const deletedMessage = await Message.findByIdAndDelete(req.params.id);
    if (!deletedMessage) return res.status(404).json({ message: "Mesaj bulunamadı" });
    res.status(200).json({ message: "Mesaj başarıyla silindi", id: req.params.id });
  } catch (err) {
    res.status(500).json({ message: "Mesaj silinemedi", error: err.message });
  }
});

// 📩 Mesaj gönderme
router.post("/send", async (req, res) => {
  const { from, to, text } = req.body;
  try {
    const newMessage = new Message({ from, to, text });
    const savedMessage = await newMessage.save();
    res.status(200).json(savedMessage);
  } catch (err) {
    res.status(500).json({ message: "Mesaj gönderilemedi", error: err.message });
  }
});

// 📜 İki kullanıcı arasındaki mesajları getir
router.get("/:from/:to", async (req, res) => {
  const { from, to } = req.params;
  try {
    const messages = await Message.find({
      $or: [{ from, to }, { from: to, to: from }],
    }).sort({ createdAt: 1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ message: "Mesajlar alınamadı", error: err.message });
  }
});

module.exports = router;
