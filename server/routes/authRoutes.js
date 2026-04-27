const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User"); // Mongoose modeli

const router = express.Router();

// Kayıt ol
router.post("/register", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun" });
  }

  try {
    // Aynı email ile kullanıcı var mı kontrolü (isteğe bağlı ama önerilir)
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Bu e-posta zaten kayıtlı" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ message: "Kayıt başarılı", email: user.email });
  } catch (err) {
    console.error("Kayıt hatası:", err);
    res.status(500).json({
      message: "Sunucu hatası",
      error: err.message,
      stack: err.stack,
    });
  }
});

// Giriş yap
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Lütfen tüm alanları doldurun" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Kullanıcı bulunamadı. Lütfen önce kayıt olun." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Şifre hatalı" });
    }

    res.status(200).json({
      message: "Giriş başarılı",
      userId: user._id,
      email: user.email,
    });
  } catch (error) {
    console.error("Giriş hatası:", error);
    res.status(500).json({
      message: "Sunucu hatası",
      error: error.message,
      stack: error.stack,
    });
  }
});

module.exports = router;
