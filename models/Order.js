const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  userName: String,
  products: [],
  createdAt: String,
  payed: Boolean,
  status: String,
  price: Number,
});
module.exports = Order = mongoose.model("order", OrderSchema);
