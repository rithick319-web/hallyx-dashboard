const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const FILE = "orders.json";

app.use(express.json());
app.use(express.static(path.join(__dirname)));

function readOrders() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, "[]");
  }
  return JSON.parse(fs.readFileSync(FILE));
}

function saveOrders(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/orders", (req, res) => {
  res.json(readOrders());
});

app.post("/orders", (req, res) => {
  const orders = readOrders();
  const order = {
    id: Date.now(),
    first: req.body.first,
    last: req.body.last,
    phone: req.body.phone,
    email: req.body.email,
    qty: req.body.qty,
    price: req.body.price,
    status: req.body.status
  };
  orders.push(order);
  saveOrders(orders);
  res.json(order);
});

app.put("/orders/:id", (req, res) => {
  let orders = readOrders();
  const id = Number(req.params.id);
  const index = orders.findIndex(o => o.id === id);
  if (index === -1) {
    return res.json({ error: "Order not found" });
  }
  orders[index] = { id, ...req.body };
  saveOrders(orders);
  res.json(orders[index]);
});

app.delete("/orders/:id", (req, res) => {
  const id = Number(req.params.id);
  let orders = readOrders();
  orders = orders.filter(o => o.id !== id);
  saveOrders(orders);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log("Server running at http://localhost:3000");
});