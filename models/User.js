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
  shops: [
    {
      type: Schema.Types.ObjectId,
      ref: "shops",
    },
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: "shops",
    },
  ],
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
  ],
  likes: [
    {
      type: Schema.Types.ObjectId,
      ref: "products",
    },
  ],
});
module.exports = User = mongoose.model("users", UserSchema);
