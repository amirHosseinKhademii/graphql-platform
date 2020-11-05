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
  shop: {
    type: Schema.Types.ObjectId,
    ref: "shops",
  },
  comments: [
    {
      user: String,
      body: String,
      createdAt: String,
      updatedAt: String,
    },
  ],
  likes: [
    {
      user: String,
      createdAt: String,
      updatedAt: String,
    },
  ],
  commentCount: Number,
  likeCount: Number,
  createdAt: String,
  updatedAt: String,
});

module.exports = Product = mongoose.model("products", ProductSchema);
