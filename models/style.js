const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StyleSchema = new Schema({
  style: String,
});

module.exports = Style = mongoose.model("style", StyleSchema);
