const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: String,
  lastName: String,
  userName: String,
  email: String,
  password: String,
  type: String,
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
  shops: [
    {
      type: Schema.Types.ObjectId,
      ref: "shops",
    },
  ],
});
module.exports = User = mongoose.model("users", UserSchema);
