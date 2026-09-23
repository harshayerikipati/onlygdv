const express = require("express");
const prisma = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Delivery boy: my profile + assigned orders
router.get("/me", requireAuth, requireRole("DELIVERY"), async (req, res, next) => {
  try {
    const boy = await prisma.deliveryBoy.findUnique({
      where: { userId: req.user.id },
      include: { orders: { include: { items: true, vendor: true } } },
    });
    res.json(boy);
  } catch (err) {
    next(err);
  }
});

// Delivery boy: toggle availability
router.put("/availability", requireAuth, requireRole("DELIVERY"), async (req, res, next) => {
  try {
    const { isAvailable } = req.body;
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

module.exports = router;
