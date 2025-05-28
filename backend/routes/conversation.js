const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const UserAuth = require("../db/user");

router.post('/start', async (req, res) => {
  const { senderId, recipientUsername } = req.body;

  try {
    const recipient = await UserAuth.findOne({ name: recipientUsername });
    if (!recipient) return res.status(404).send('Recipient not found');

    const recipientId = recipient._id;

    // Check if conversation already exists
    let convo = await Conversation.findOne({
      participants: { $all: [senderId, recipientId] }
    }).populate('participants', 'name'); 

    if (!convo) {
      convo = await Conversation.create({
        participants: [senderId, recipientId],
        message: []
      });
      convo = await Conversation.findById(convo._id).populate('participants', 'name');
    }

    res.json(convo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


router.get('/:id', async (req, res) => {
  try {
    const convo = await Conversation.findById(req.params.id)
      .populate('participants', 'name')
      .populate('message.sender', 'name'); // Populate sender in messages

    if (!convo) {
      return res.status(404).send('Conversation not found');
    }

    res.json(convo);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



module.exports = router;
