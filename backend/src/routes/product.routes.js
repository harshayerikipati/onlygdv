const express = require("express");
const prisma = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

// Public: browse products (optionally filter by category/vendor)
router.get("/", async (req, res, next) => {
  try {
    const { categoryId, vendorId, q } = req.query;
    const products = await prisma.product.findMany({
      where: {
        isAvailable: true,
        ...(categoryId && { categoryId }),
        ...(vendorId && { vendorId }),
        ...(q && { name: { contains: q, mode: "insensitive" } }),
      },
      include: { vendor: { select: { businessName: true, type: true } }, category: true },
    });
    res.json(products);
  } catch (err) {
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id: req.params.id },
      include: { vendor: true, category: true },
    });
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    next(err);
  }
});

// Vendor: create/update/delete their own products
router.post("/", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
    if (!vendor) return res.status(404).json({ error: "Vendor profile not found" });

    const { name, description, price, discountPrice, stock, unit, categoryId, imageUrl } = req.body;
    const product = await prisma.product.create({
      data: {
        vendorId: vendor.id,
        name,
        description,
        price,
        discountPrice,
        stock,
        unit,
        categoryId,
        imageUrl,
      },
    });
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
});

router.put("/:id", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.vendorId !== vendor.id) {
      return res.status(404).json({ error: "Product not found" });
    }
    const updated = await prisma.product.update({
      where: { id: req.params.id },
      data: req.body,
    });
    res.json(updated);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", requireAuth, requireRole("VENDOR"), async (req, res, next) => {
  try {
    const vendor = await prisma.vendor.findUnique({ where: { userId: req.user.id } });
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product || product.vendorId !== vendor.id) {
      return res.status(404).json({ error: "Product not found" });
    }
    await prisma.product.delete({ where: { id: req.params.id } });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
