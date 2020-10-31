const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  lastName: String,
  userName: String,
  email: String,
  password: String,
  createdAt: String,
  profile: {
    userName: String,
    country: String,
    region: String,
    city: String,
    address: String,
    phone: String,
    image: String,
    postCode: String,
  },
  followerCount: Number,
  followers: [],
});
module.exports = User = mongoose.model("user", UserSchema);
