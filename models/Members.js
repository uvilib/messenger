const { Schema, model } = require("mongoose");

const schema = new Schema({
  memberArray: [
    {
      id: { type: String },
      username: { type: String },
      icon: { type: String },
    },
  ],
  owner: { type: String },
});

module.exports = model("members", schema);
