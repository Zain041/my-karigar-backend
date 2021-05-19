const express = require("express");
const router = express.Router();
const cors = require("cors");
const { check, validationResult } = require("express-validator");

const auth = require("../middleware/auth");
const Chats = require("../models/Chat");
const Profile = require("../models/Profile");
const addNotification = require("./notificationFunc");

router.use(cors());

// @route   POST api/chats/sendMessage
// @desc    Send Message
// @access  Public
router.post(
  "/sendMessage",
  [
    check("receiver", "Receiver Id is required").not().isEmpty(),

    check("message", "Message is required").not().isEmpty(),
  ],
  auth,
  async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiver, message } = req.body;
    const sender = req.user._id;
    let chatIdArray = [sender, receiver].sort();
    let chatId = chatIdArray[0] + chatIdArray[1];

    try {
      let chat = await Chats.findOne({ chatId: chatId });
      if (chat) {
        chat = await Chats.findOneAndUpdate(
          { chatId: chatId },
          {
            $set: { last_updated: Date.now() },
            $push: { messages: { message: message, sendBy: sender } },
          },
          { new: true }
        );
        let profile = await Profile.findOne({ user: sender }).select(
          "fullName"
        );
        addNotification(
          "Message sent",
          receiver,
          profile.fullName + " sent you a new message."
        );
        return res.json(chat);
      } else {
        chat = new Chats({
          chatId,
          sender,
          receiver,
          messages: { message: message, sendBy: sender },
        });
        await chat.save();
        let profile = await Profile.findOne({ user: sender }).select(
          "fullName"
        );
        addNotification(
          "Message sent",
          receiver,
          profile.fullName + " sent you a new message."
        );
        return res.json(chat);
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

// @route   POST api/chats/getAllMessages
// @desc    Get All Messages
// @access  Public
router.post("/getAllMessages", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let request = [];
    let chat = await Chats.find({
      $or: [{ receiver: req.user._id }, { sender: req.user._id }],
    }).sort({ last_updated: -1 });

    if (!chat)
      return res.status(400).json({ err: [{ msg: "Messages not found." }] });
    for (msg in chat) {
      let profile1 = await Profile.findOne({ user: chat[msg].sender}) 
        .select("avatar")
        .select("fullName");
      let profile2 = await Profile.findOne({ user: chat[msg].receiver })
        .select("avatar")
        .select("fullName");
      let profile = profile1 + profile2;
      if (profile) {
        request.push({
          sender: profile1,
          receiver: profile2,
          message: chat[msg],
        });
      } else {
        request.push({ message: chat[msg] });
      }
    }
    return res.json(request);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
}); 

// @route   POST api/chats/getUserMessages
// @desc    Get User Messages
// @access  Public
router.post("/getUserMessages", auth, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    let request = [];
    let chat = await Chats.find({ _id: req.body._id });
    if (!chat)
      return res.status(400).json({ err: [{ msg: "Messages not found." }] });
    for (msg in chat) {
      let profile1 = await Profile.findOne({ user: chat[msg].sender })
        .select("avatar")
        .select("fullName");
      let profile2 = await Profile.findOne({ user: chat[msg].receiver })
        .select("avatar")
        .select("fullName");
      let profile = profile1 + profile2;
      if (profile) {
        request.push({
          sender: profile1,
          receiver: profile2,
          message: chat[msg],
        });
      } else {
        request.push({ message: chat[msg] });
      }
    }
    return res.json({ request });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
