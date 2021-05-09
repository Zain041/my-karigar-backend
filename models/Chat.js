const mongoose = require("mongoose");
mongoose.set("useCreateIndex", true);
const Schema = mongoose.Schema;

// Create Schema
const Chats = new Schema({
  chatId: {
    type: String,
    required: true,
  },
  last_updated: {
    type: Date,
    default: Date.now(),
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  receiver: {
    type: Schema.Types.ObjectId,
    ref: "users",
    default: null,
  },
  messages: [
    {
      message: {
        type: [String],
        required: true,
        default: null,
      },
      sendBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        default: null,
      },
      date: {
        type: Date,
        default: Date.now(),
      },
    },
  ],
});

module.exports = User = mongoose.model("chats", Chats);
