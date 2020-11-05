const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  body: String,
  createdAt: String,
  updatedAt: String,
});

module.exports = Comment = mongoose.model("comments", CommentSchema);
