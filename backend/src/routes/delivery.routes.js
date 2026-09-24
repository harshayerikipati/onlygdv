const express = require("express");
const prisma = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Delivery boy: my profile + assigned orders
router.get("/me", requireAuth, requireRole("DELIVERY"), async (req, res, next) => {
  try {
    const boy = await prisma.deliveryBoy.findUnique({
      where: { userId: req.user.id },
      include: {
        orders: {
          include: {
            items: { include: { product: true } },
            vendor: true,
            customer: { select: { name: true, phone: true } },
          },
        },
      },
    });
    res.json(boy);
  } catch (err) {
    next(err);
  }
});

// Delivery boy: toggle availability — blocked until admin has verified/approved this rider
router.put("/availability", requireAuth, requireRole("DELIVERY"), async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
    const existing = await prisma.deliveryBoy.findUnique({ where: { userId: req.user.id } });
    if (existing.status !== "APPROVED") {
      return res.status(403).json({ error: "Your account is still pending verification by the admin team." });
    }
    const boy = await prisma.deliveryBoy.update({
      where: { userId: req.user.id },
      data: { isAvailable },
    });
    res.json(boy);
  } catch (err) {
    next(err);
  }
});

// Delivery boy: update live location
router.put("/location", requireAuth, requireRole("DELIVERY"), async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    const boy = await prisma.deliveryBoy.update({
      where: { userId: req.user.id },
      data: { currentLat: lat, currentLng: lng },
    });
    req.app.get("io").emit(`delivery_location:${boy.id}`, { lat, lng });
    res.json(boy);
  } catch (err) {
    next(err);
  }
});

// Admin: list all delivery boys awaiting approval / all
router.get("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const boys = await prisma.deliveryBoy.findMany({ include: { user: true } });
    res.json(boys);
  } catch (err) {
    next(err);
  }
});

// Admin: approve / suspend a rider (verification gate before they can go online)
router.put("/:id/status", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { status } = req.body; // APPROVED | SUSPENDED | PENDING
    const boy = await prisma.deliveryBoy.update({ where: { id: req.params.id }, data: { status } });
    res.json(boy);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
