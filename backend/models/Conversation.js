const mongoose = require("mongoose");


const ConversationSchema = new mongoose.Schema({
    participants:[{type: mongoose.Schema.Types.ObjectId, ref:'userauth'}],
    
    message: [{
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'userauth' }, // ✅ Not array
  text: String,
  timestamp: { type: Date, default: Date.now }
}],

    
    });


    module.exports = mongoose.model('Conversation', ConversationSchema);