const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  name: String,
  country: String,
  region: String,
  city: String,
  images: [],
  type: String,
  createdAt: String,
  followerCount: Number,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: "users",
    },
  ],
});
module.exports = Shop = mongoose.model("shops", ShopSchema);
