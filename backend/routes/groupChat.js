const express = require("express");
const router = express.Router();
const Conversation = require("../models/Conversation");
const User = require("../models/User");
const UserAuth = require("../db/user");
const groupChat = require("../models/groupChat");



// Create a group chat

router.post('/create',async(req,res)=>{
    const {name, participantsIds} = req.body;
    const group = await groupChat.create({
        name,
        participants: participantsIds,
        message:[]
    })
    res.json(group);
    
});

// Get all group chats for a user

router.get('/user/:userId', async (req, res) => {
  const groups = await groupChat.find({
    participants: req.params.userId
  }).populate('participants', 'name');
  res.json(groups);
});

// Get group messages 

router.get('/:groupId', async (req, res) => {
  try {
    const group = await groupChat.findById(req.params.groupId)
      .populate('messages.sender', 'name');
    res.json(group);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});



router.patch('/join/:groupId', async (req, res) => {
  const { userId } = req.body;
  const group = await groupChat.findById(req.params.groupId);
  if (!group) return res.status(404).send('Group not found');

  if (!group.participants.includes(userId)) {
    group.participants.push(userId);
    await group.save();
  }

  res.json({ message: 'Joined group successfully' });
});


module.exports = router;

