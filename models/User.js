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
    image: String,
    address: String,
    phone: Number,
    idCode: Number,
    postCode: Number,
    userName: String,
  },
  cart: [],
});
module.exports = User = mongoose.model("user", UserSchema);
