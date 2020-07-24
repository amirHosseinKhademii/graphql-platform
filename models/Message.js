const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  text: String,
  user: {},
  createdAt: String,
  channelId: String,
});
module.exports = Message = mongoose.model("message", messageSchema);
