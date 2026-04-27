const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  members: {
    type: [String],     // Kullanıcı e-postaları ya da ID'leri burada tutulur
    required: true,
    validate: [arrayLimit, '{PATH} alanı 2 kullanıcı içermeli.'],
  },
  messages: [
    {
      from: { type: String, required: true },
      to: { type: String, required: true },
      text: { type: String, required: true },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

function arrayLimit(val) {
  return val.length === 2;  // members dizisi kesinlikle 2 eleman olmalı
}

module.exports = mongoose.model("Chat", chatSchema);
