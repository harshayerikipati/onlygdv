const express = require("express");
const prisma = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public: browse approved vendors (e.g. list restaurants near you - filter by lat/lng later)
router.get("/", async (req, res, next) => {
  try {
    const { type } = req.query;
    const vendors = await prisma.vendor.findMany({
      where: { status: "APPROVED", ...(type && { type }) },
      select: { id: true, businessName: true, type: true, logoUrl: true },
    });
    res.json(vendors);
  } catch (err) {
    next(err);
  }
});

// Vendor: get my own profile
router.get("/me", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({
      where: { userId: req.user.id },
      include: { products: true },
    });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

router.put("/me", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const { businessName, logoUrl } = req.body;
    const vendor = await prisma.vendor.update({
      where: { userId: req.user.id },
      data: { businessName, logoUrl },
    });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

// Admin: approve / suspend vendors
router.get("/pending", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const vendors = await prisma.vendor.findMany({ where: { status: "PENDING" } });
    res.json(vendors);
  } catch (err) {
    next(err);
  }
});

router.put("/:id/status", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { status } = req.body; // APPROVED | SUSPENDED | PENDING
    const vendor = await prisma.vendor.update({ where: { id: req.params.id }, data: { status } });
    res.json(vendor);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
