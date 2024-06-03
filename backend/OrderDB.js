const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const OrderSchema = new Schema({
  stockName: String,
  instrumentKey: String,
  status: String,
  buying: Boolean,
  orderType: String,
  quantity: Number,
  price: Number,
  stopLoss: Number,
});
module.exports = mongoose.model("OrderDB", OrderSchema);
