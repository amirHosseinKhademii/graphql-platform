const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  title: String,
  userName: String,
  image: String,
  price: Number,
  color: String,
  company: String,
  size: String,
  number: Number,
  desc: String,
  createdAt: String,
  comments: [
    {
      userName: String,
      body: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      userName: String,
      createdAt: String,
    },
  ],
  commentCount: Number,
  likeCount: Number,
});
module.exports = Product = mongoose.model("product", ProductSchema);
