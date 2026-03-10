import { Router } from "express";
import ActionCard from "../models/actionCard.model.js";

const router = Router();

router.get("/", async (_req, res) => {
  try {
    const cards = await ActionCard.find();
    res.json(cards);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching action cards", error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const card = await ActionCard.findById(req.params.id);
    if (!card) return res.status(404).json({ msg: "Action card not found" });
    res.json(card);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching action card", error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const card = await ActionCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ msg: "Action card not found" });
    res.json({ msg: "Action card deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting action card", error: err.message });
  }
});

export default router;

