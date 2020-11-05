const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LikeSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  belongsTo: {
    type: Schema.Types.ObjectId,
    ref: "products",
  },
  createdAt: String,
  updatedAt: String,
});

module.exports = Like = mongoose.model("likes", LikeSchema);
