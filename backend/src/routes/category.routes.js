const express = require("express");
const prisma = require("../config/db");
const { requireAuth, requireRole } = require("../middleware/auth");

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

router.post("/", requireAuth, requireRole("ADMIN"), async (req, res, next) => {
  try {
    const { name, parentId, imageUrl } = req.body;
    const category = await prisma.category.create({ data: { name, parentId, imageUrl } });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
