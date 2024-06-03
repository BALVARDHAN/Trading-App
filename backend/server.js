const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const OrderDB = require("./OrderDB");
const PositionDB = require("./PositionDB");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/trading");
const db = mongoose.connection;
db.on("error", console.error.bind(console, "conntection error"));
db.once("open", () => {
  console.log("Database Connected");
});

app.get("/", async (req, res) => {
  const result = await OrderDB.find({});
  res.send(JSON.stringify(result));
});

app.post("/", async (req, res) => {
  const order = new OrderDB(req.body);
  await order.save();
  const result = await OrderDB.find({});
  res.send(JSON.stringify(result));
});

app.post("/status", async (req, res) => {
  await OrderDB.updateOne(
    { _id: req.body.id },
    { $set: { status: "Success" } }
  );
  // let temp;
  // await PositionDB.findOne({
  //   instrumentKey: req.body.instrumentKey,
  // }).then((doc) => {
  //   temp = doc;
  // });
  // if (temp) {
  //   console.log("HELLLO");
  //   console.log(temp);
  //   console.log("HELLLO");
  //   await PositionDB.updateOne(
  //     { instrumentKey: req.body.instrumentKey },
  //     { $set: { quantity: temp.quantity + req.body.quantity } }
  //   );
  // } else {
  //   const posi = new PositionDB(req.body);
  //   await posi.save();
  // }
  const result = await OrderDB.find({});
  res.send(JSON.stringify(result));
});

app.get("/position", async (req, res) => {
  const result = await PositionDB.find({});
  res.send(JSON.stringify(result));
});

app.listen(3030, () => {
  console.log("SERVER IS LISTENING TO 3030");
});
