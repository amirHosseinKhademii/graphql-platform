const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  userName: String,
  content: String,
  image: String,
  likes: [{ userName: String, createdAt: String }],
  comments: [
    {
      userName: String,
      body: String,
      createdAt: String,
    },
  ],
  likeCount: Number,
  commentCount: Number,
  createdAt: String,
  updatedAt: String,
});

module.exports = Post = mongoose.model("post", PostSchema);
