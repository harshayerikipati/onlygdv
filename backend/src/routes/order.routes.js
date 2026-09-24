const express = require("express");
const prisma = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Customer: place an order
router.post("/", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
  try {
    const {
      vendorId,
      items,
      deliveryFee = 0,
      paymentMethod = "COD",
      deliveryAddress,
      deliveryLat,
      deliveryLng,
      customerPhone,
    } = req.body;
    if (!deliveryAddress) {
      return res.status(400).json({ error: "A delivery address is required" });
    }
    // items: [{ productId, qty }]
    const products = await prisma.product.findMany({
      where: { id: { in: items.map((i) => i.productId) } },
    });

    let subtotal = 0;
    const orderItemsData = items.map((i) => {
      const product = products.find((p) => p.id === i.productId);
      if (!product) throw Object.assign(new Error(`Product ${i.productId} not found`), { status: 400 });
      const price = product.discountPrice ?? product.price;
      subtotal += price * i.qty;
      return { productId: product.id, qty: i.qty, price };
    });

    const order = await prisma.order.create({
      data: {
        customerId: req.user.id,
        vendorId,
        subtotal,
        deliveryFee,
        total: subtotal + deliveryFee,
        paymentMethod,
        deliveryAddress,
        deliveryLat,
        deliveryLng,
        customerPhone,
      items: { create: orderItemsData },
      },
      include: { items: true, vendor: true },
    });

    // Notify vendor in real time
    req.app.get("io").to(`vendor:${vendorId}`).emit("new_order", order);

    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
});

// Customer: my orders
router.get("/mine", requireAuth, requireRole("CUSTOMER"), async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      where: { customerId: req.user.id },
      include: {
        items: { include: { product: true } },
        vendor: { select: { businessName: true, address: true } },
        deliveryBoy: { include: { user: { select: { name: true, phone: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Vendor: orders for my store
router.get("/vendor", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
    const orders = await prisma.order.findMany({
      where: { vendorId: vendor.id },
      include: {
        items: { include: { product: true } },
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Vendor/Delivery/Admin: update order status
router.put("/:id/status", requireAuth, requireRole("VENDOR", "DELIVERY", "ADMIN"), async (req, res, next) => {
  try {
    const { status } = req.body; // ACCEPTED | PREPARING | READY | PICKED_UP | DELIVERED | CANCELLED
    const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });

    req.app.get("io").to(`order:${order.id}`).emit("status_update", { orderId: order.id, status });
    res.json(order);
  } catch (err) {
    next(err);
  }
});

// Admin: all orders across the platform
router.get("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: true,
        vendor: { select: { businessName: true } },
        customer: { select: { name: true, phone: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    res.json(orders);
  } catch (err) {
    next(err);
  }
});

// Admin/Delivery: assign a delivery boy to a ready order
router.put("/:id/assign", requireAuth, requireRole("ADMIN", "DELIVERY"), async (req, res, next) => {
  try {
    const { deliveryId } = req.body;
    const order = await prisma.order.update({
      where: { id: req.params.id },
      data: { deliveryId },
    });
    req.app.get("io").to(`delivery:${deliveryId}`).emit("assigned_order", order);
    res.json(order);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
