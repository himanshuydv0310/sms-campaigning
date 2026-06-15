import express from "express";
import Campaign from "../models/Campaign.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, async (req, res) => {
  try {
    const { title, message, audience, sentTo } = req.body;

    const campaign = await Campaign.create({
      title,
      message,
      audience,
      sentTo,
      status: "Sent",
      user: req.user._id,
    });

    res.status(201).json(campaign);
  } catch (error) {
    res.status(500).json({ message: "Failed to create campaign" });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const campaigns = await Campaign.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(campaigns);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch campaigns" });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const campaign = await Campaign.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!campaign) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    await campaign.deleteOne();

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete campaign" });
  }
});

export default router;