const { Schema, model } = require("mongoose");

const schema = new Schema({
  messages: [
    {
      text: { type: String },
      sender: { type: String },
    },
  ],
  owner: { type: String },
  recepient: { type: String },
});

module.exports = model("message", schema);
