const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ShopSchema = new Schema({
  name: String,
  owner: {
    type: Schema.Types.ObjectId,
    ref: "users",
  },
  country: String,
  region: String,
  city: String,
  images: [],
  type: String,
  createdAt: String,
  followerCount: Number,
  followers: [],
});
module.exports = Shop = mongoose.model("shops", ShopSchema);
