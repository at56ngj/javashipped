const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/coffeeDB")
  .then(async () => {
    console.log("MongoDB connected");
    await seedDrinks();
  })
  .catch((err) => console.log("Connection error:", err.message));

app.get("/", (req, res) => {
  res.send("JavaShipped backend is running");
});

// Drink model (matches the drinks collection in coffeeDB)
const drinkSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  stock: Number,
});
const Drink = mongoose.model("Drink", drinkSchema);

// Adds the default drinks only if the drinks collection is empty
// (so a fresh Docker/cloud database is never left with an empty menu)
async function seedDrinks() {
  if ((await Drink.countDocuments()) > 0) return;
  await Drink.insertMany([
    { name: "Latte", description: "Smooth espresso with steamed milk", price: 150, stock: 20 },
    { name: "Cappuccino", description: "Espresso with thick milk foam", price: 140, stock: 20 },
    { name: "Espresso", description: "Strong and bold single shot", price: 100, stock: 20 },
    { name: "Cold Coffee", description: "Chilled coffee blended with ice cream", price: 160, stock: 15 },
    { name: "Mocha", description: "Coffee with chocolate and milk", price: 170, stock: 15 },
    { name: "Americano", description: "Espresso diluted with hot water", price: 120, stock: 25 },
  ]);
  console.log("Default drinks added");
}

// GET /drinks -> send all drinks
app.get("/drinks", async (req, res) => {
  const drinks = await Drink.find();
  res.json(drinks);
});

// Order and Customer models
const orderSchema = new mongoose.Schema({
  orderId: Number,
  customerName: String,
  mobile: String,
  drink: String,
  size: String,
  quantity: Number,
  totalAmount: Number,
  address: String,
  status: { type: String, default: "Received" },
});
const Order = mongoose.model("Order", orderSchema);

const customerSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  address: String,
});
const Customer = mongoose.model("Customer", customerSchema);

// POST /orders -> place a new order
app.post("/orders", async (req, res) => {
  const { customerName, mobile, drink, size, quantity, address } = req.body;

  // 1. find the drink
  const drinkDoc = await Drink.findOne({ name: drink });
  if (!drinkDoc) {
    return res.status(404).json({ message: "Drink not found" });
  }

  // 2. check stock
  if (drinkDoc.stock === 0) {
    return res.status(400).json({ message: "Out of stock" });
  }
  if (drinkDoc.stock < quantity) {
    return res.status(400).json({ message: "Only " + drinkDoc.stock + " left in stock" });
  }

  // 3. make a new order id (last id + 1, starting from 1001)
  const last = await Order.findOne().sort({ orderId: -1 });
  const orderId = last ? last.orderId + 1 : 1001;

  // 4. save the order with status Received
  const order = await Order.create({
    orderId,
    customerName,
    mobile,
    drink,
    size,
    quantity,
    address,
    totalAmount: drinkDoc.price * quantity,
    status: "Received",
  });

  // 5. reduce the stock
  drinkDoc.stock = drinkDoc.stock - quantity;
  await drinkDoc.save();

  // 6. save the customer (updates if the mobile number already exists)
  await Customer.findOneAndUpdate(
    { mobile },
    { name: customerName, mobile, address },
    { upsert: true }
  );

  res.status(201).json(order);
});

// GET /orders -> all orders (used by Kitchen and Order Status pages)
app.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// PUT /orders/:orderId/status -> kitchen changes the status
app.put("/orders/:orderId/status", async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { orderId: req.params.orderId },
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
});

// DELETE /orders/:orderId -> cancel (only if status is Received)
app.delete("/orders/:orderId", async (req, res) => {
  const order = await Order.findOne({ orderId: req.params.orderId });
  if (!order) {
    return res.status(404).json({ message: "Order not found" });
  }
  if (order.status !== "Received") {
    return res.status(400).json({ message: "Cannot cancel now" });
  }
  await Drink.updateOne({ name: order.drink }, { $inc: { stock: order.quantity } });
  await Order.deleteOne({ orderId: order.orderId });
  res.json({ message: "Order cancelled" });
});

// GET /analytics -> total orders, total sales, orders per drink
app.get("/analytics", async (req, res) => {
  const orders = await Order.find();
  const totalOrders = orders.length;
  const totalSales = orders.reduce((sum, o) => sum + o.totalAmount, 0);

  const perDrink = {};
  orders.forEach((o) => {
    perDrink[o.drink] = (perDrink[o.drink] || 0) + 1;
  });

  res.json({ totalOrders, totalSales, perDrink });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server running on port " + PORT));