const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { z } = require("zod");
const prisma = require("../config/db");

const router = express.Router();

const signupSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(6),
  email: z.string().email().optional(),
  password: z.string().min(6),
  role: z.enum(["CUSTOMER", "VENDOR", "DELIVERY"]), // ADMIN created manually, not via public signup
  // extra fields used when role is VENDOR
  businessName: z.string().optional(),
  vendorType: z.enum(["SHOP", "RESTAURANT", "GROCERY"]).optional(),
  // extra field used when role is DELIVERY
  vehicleType: z.string().optional(),
});

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });
}

router.post("/signup", async (req, res, next) => {
  try {
    const data = signupSchema.parse(req.body);
    const existing = await prisma.user.findUnique({ where: { phone: data.phone } });
    if (existing) return res.status(409).json({ error: "Phone already registered" });

    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        phone: data.phone,
        email: data.email,
        passwordHash,
        role: data.role,
      },
    });

    // Create the role-specific profile row
    if (data.role === "VENDOR") {
      await prisma.vendor.create({
        data: {
          userId: user.id,
          businessName: data.businessName || data.name,
          type: data.vendorType || "SHOP",
        },
      });
    } else if (data.role === "DELIVERY") {
      await prisma.deliveryBoy.create({ data: { userId: user.id, vehicleType: data.vehicleType } });
    }

    const token = signToken(user);
    res.status(201).json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    if (err.name === "ZodError") return res.status(400).json({ error: err.errors });
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { phone, password } = req.body;
    if (!phone || !password) {
      return res.status(400).json({ error: "Phone and password are required" });
    }
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) return res.status(401).json({ error: "Invalid phone or password" });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ error: "Invalid phone or password" });

    const token = signToken(user);
    res.json({ token, user: { id: user.id, name: user.name, role: user.role } });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
