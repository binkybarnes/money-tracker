const express = require("express");
const cors = require("cors");
require("dotenv").config();
const Transaction = require("./models/Transaction.js");
const { default: mongoose } = require("mongoose");
const app = express();

app.use(
  cors({
    origin: ["https://money-tracker-sooty-mu.vercel.app/"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    credentials: true,
  })
);
app.use(express.json());

app.get("/api/test", (req, res) => {
  res.json("test ok3");
});

app.post("/api/transaction", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const { name, description, datetime, price } = req.body;
  const transaction = await Transaction.create({
    name,
    description,
    datetime,
    price,
  });
  res.json(transaction);
});

app.delete("/api/transaction/:id", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const result = await Transaction.deleteOne({ _id: req.params.id });
  res.send(result);
});

app.get("/api/transactions", async (req, res) => {
  await mongoose.connect(process.env.MONGO_URL);
  const transactions = await Transaction.find();
  res.json(transactions);
});

app.listen(4040);
// 03222006
