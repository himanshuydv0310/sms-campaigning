import express from "express";
import Contact from "../models/Contact.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/add", protect, async (req, res) => {
  try {
    const { name, phone, email, group } = req.body;

    const contact = await Contact.create({
      name,
      phone,
      email,
      group,
      user: req.user._id,
    });

    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({
      message: "Failed to add contact",
    });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user._id }).sort({
      createdAt: -1,
    });

    res.json(contacts);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch contacts",
    });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const contact = await Contact.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    await contact.deleteOne();

    res.json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete contact",
    });
  }
});

export default router;