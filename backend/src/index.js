require("dotenv").config();
const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const categoryRoutes = require("./routes/category.routes");
const vendorRoutes = require("./routes/vendor.routes");
const orderRoutes = require("./routes/order.routes");
const deliveryRoutes = require("./routes/delivery.routes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ ok: true, service: "onlygdv-backend" }));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/delivery", deliveryRoutes);

// generic error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Server error" });
});

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Basic real-time channel: order status updates, vendor order alerts.
// Rooms are joined per user/vendor/delivery id from the client after auth.
io.on("connection", (socket) => {
  socket.on("join", (room) => socket.join(room));
});
app.set("io", io);

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log(`OnlyGDV backend running on port ${PORT}`));
