const mongoose = require("mongoose");

const groupChatSchema = new mongoose.Schema({
  name: String,
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'userauth' }],
  messages: [  // ✅ must be "messages" (plural)
    {
      sender: { type: mongoose.Schema.Types.ObjectId, ref: 'userauth' },
      text: String,
      timestamp: { type: Date, default: Date.now }
    }
  ]
});

module.exports = mongoose.model('GroupChat', groupChatSchema);
