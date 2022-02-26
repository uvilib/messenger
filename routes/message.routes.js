const { Router } = require("express");
const User = require("../models/User");
const Message = require("../models/Message");
const auth = require("../middleware/auth.middleware");
const router = Router();

router.get("/", auth, async (req, res) => {
  try {
    const message = await Message.find({ owner: req.user.userId });
    let arr = [];

    async function processArray() {
      for (const item of message) {
        const recepient = await User.findOne({ _id: item.recepient });
        arr.push({
          icon: recepient.imgURL,
          username: recepient.name + " " + recepient.surname,
          recepient: item.recepient,
          status: recepient.status,
        });
      }
      res.json(arr);
    }
    processArray();

    if (!message) {
      return res.json(null);
    }
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/conversation", auth, async (req, res) => {
  try {
    const { id } = req.body;

    const owner = await User.findOne({ _id: req.user.userId });
    const recepient = await User.findOne({ _id: id });

    const message = await Message.findOne({
      owner: req.user.userId,
      recepient: id,
    });

    if (message) {
      return res.json({
        usernameRecepient: recepient.name + " " + recepient.surname,
        idRecipient: recepient._id,
        message: message.messages,
        icon: recepient.imgURL,
        myIcon: owner.imgURL,
        status: recepient.status,
      });
    }

    const newOwnerMessage = new Message({
      messages: [],
      owner: req.user.userId,
      recepient: id,
      status: recepient.status,
    });

    const newRecepientMessage = new Message({
      messages: [],
      owner: id,
      recepient: req.user.userId,
    });

    newOwnerMessage.save();
    newRecepientMessage.save();

    return res.json({
      usernameRecepient: recepient.name + " " + recepient.surname,
      idRecipient: recepient._id,
      icon: recepient.imgURL,
      myIcon: owner.imgURL,
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/add", auth, async (req, res) => {
  try {
    const { text, sender, recepient } = req.body;

    const messages = {
      text,
      sender,
    };

    const owner = await Message.findOne({
      owner: req.user.userId,
      recepient,
    });
    const recepientMes = await Message.findOne({
      owner: recepient,
      recepient: req.user.userId,
    });

    if (owner && recepientMes) {
      Message.findOneAndUpdate(
        { owner: req.user.userId, recepient },
        { $push: { messages } },
        function (error, success) {
          if (error) {
          } else {
          }
        }
      );

      Message.findOneAndUpdate(
        { owner: recepient, recepient: req.user.userId },
        { $push: { messages } },
        function (error, success) {
          if (error) {
          } else {
          }
        }
      );

      return res.status(201).json({ message: "Сообщение создано" });
    }

    const ownerMessages = new Message({
      messages,
      owner: req.user.userId,
      recepient,
    });

    const recepientMessages = new Message({
      messages,
      owner: recepient,
      recepient: req.user.userId,
    });

    await ownerMessages.save();
    await recepientMessages.save();

    return res.json({ message: "Создано" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/delete", auth, async (req, res) => {
  try {
    const { recepient } = req.body;

    await Message.findOneAndDelete({
      owner: req.user.userId,
      recepient,
    });

    await Message.findOneAndDelete({
      owner: recepient,
      recepient: req.user.userId,
    });

    return res.json({ message: "Удалено" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
