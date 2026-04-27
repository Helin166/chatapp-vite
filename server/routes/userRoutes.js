const express = require("express");
const User = require("../models/User");

const router = express.Router();

// Tüm kullanıcıları getir (güvenlik için e-posta hariç olabilir, şimdilik tüm email dönebiliriz)
router.get("/", async (req, res) => {
  try {
    const users = await User.find({}, { password: 0, __v: 0 }); // şifreyi hariç tut
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Kullanıcılar alınamadı", error: err.message });
  }
});

module.exports = router;
