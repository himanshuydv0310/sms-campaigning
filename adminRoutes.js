import express from "express";
import User from "../models/User.js";
import Contact from "../models/Contact.js";
import Campaign from "../models/Campaign.js";
import { protect, adminOnly } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalContacts = await Contact.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();

    const campaigns = await Campaign.find();

    const totalSmsSent = campaigns.reduce(
      (sum, item) => sum + (item.sentTo || 0),
      0
    );

    res.json({
      totalUsers,
      totalContacts,
      totalCampaigns,
      totalSmsSent,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to load admin stats",
    });
  }
});

router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({
      createdAt: -1,
    });

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load users",
    });
  }
});

router.get("/campaigns", protect, adminOnly, async (req, res) => {
  try {
    const campaigns = await Campaign.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({
      message: "Failed to load campaigns",
    });
  }
});

router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    await Contact.deleteMany({ user: req.params.id });
    await Campaign.deleteMany({ user: req.params.id });

    res.json({
      message: "User and related data deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
});

router.delete("/campaigns/:id", protect, adminOnly, async (req, res) => {
  try {
    await Campaign.findByIdAndDelete(req.params.id);

    res.json({
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete campaign",
    });
  }
});

export default router;