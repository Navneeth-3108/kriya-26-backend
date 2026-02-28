import AlgorithmCard from "../models/AlgorithmCard.js";

export const createCard = async (req, res) => {
  try {
    const { name, description, difficultyTag, iconUrl } = req.body;
    if (!name) {
      return res.status(400).json({ msg: "Card name is required" });
    }

    const card = new AlgorithmCard({ name, description, difficultyTag, iconUrl });
    await card.save();
    res.json(card);
  } catch (err) {
    res.status(400).json({ msg: "Error creating card", error: err.message });
  }
};

export const updateCard = async (req, res) => {
  try {
    const card = await AlgorithmCard.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!card) return res.status(404).json({ msg: "Card not found" });
    res.json(card);
  } catch (err) {
    res.status(400).json({ msg: "Error updating card", error: err.message });
  }
};

export const deleteCard = async (req, res) => {
  try {
    const card = await AlgorithmCard.findByIdAndDelete(req.params.id);
    if (!card) return res.status(404).json({ msg: "Card not found" });
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting card", error: err.message });
  }
};

export const getCards = async (_req, res) => {
  try {
    const cards = await AlgorithmCard.find();
    res.json(cards);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching cards", error: err.message });
  }
};

export const getCard = async (req, res) => {
  try {
    const card = await AlgorithmCard.findById(req.params.id);
    if (!card) return res.status(404).json({ msg: "Card not found" });
    res.json(card);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching card", error: err.message });
  }
};