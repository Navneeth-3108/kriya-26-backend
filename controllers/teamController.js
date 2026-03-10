import Team from "../models/Team.js";
import ActionCard from "../models/actionCard.model.js";
import { applyActionCardEffect } from "../services/actionCardEffects.js";

export const getTeams = async (_req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching teams", error: err });
  }
};

export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching team", error: err });
  }
};

export const createTeam = async (req, res) => {
  try {
    const { teamName, kriyaID, captainName, regMail, shipConfig } = req.body;

    if (!teamName || !kriyaID || !captainName || !regMail || !shipConfig) {
      return res.status(400).json({ msg: "All required fields must be provided" });
    }

    const team = new Team(req.body);
    await team.save();
    res.status(201).json(team);
  } catch (err) {
    res.status(400).json({ msg: "Error creating team", error: err.message });
  }
};


export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(400).json({ msg: "Error updating team", error: err });
  }
};

export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json({ msg: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting team", error: err });
  }
};

export const selectActionCards = async (req, res) => {
  try {
    const { cardIds } = req.body;

    if (!Array.isArray(cardIds) || cardIds.length === 0) {
      return res.status(400).json({ msg: "cardIds array is required" });
    }

    if (cardIds.length > 4) {
      return res.status(400).json({ msg: "You can select at most 4 action cards" });
    }

    const uniqueIds = [...new Set(cardIds.map(String))];
    if (uniqueIds.length !== cardIds.length) {
      return res.status(400).json({ msg: "Duplicate cardIds are not allowed" });
    }

    const cards = await ActionCard.find({ _id: { $in: cardIds } });
    if (cards.length !== cardIds.length) {
      return res.status(400).json({ msg: "One or more action cards not found" });
    }

    const team = await Team.findById(req.team._id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    team.round2.actionCardsUsed = cards.map((card) => ({
      cardId: card._id,
      effectType: card.effectType,
      effectValue: card.effectValue,
      usedAt: null
    }));
    team.round2.totalCardsUsed = 0;

    await team.save();

    res.json({
      msg: "Action cards selected successfully",
      round2: team.round2
    });
  } catch (err) {
    res.status(500).json({ msg: "Error selecting action cards", error: err.message });
  }
};

export const useActionCard = async (req, res) => {
  try {
    const { cardId } = req.body;

    if (!cardId) {
      return res.status(400).json({ msg: "cardId is required" });
    }

    const team = await Team.findById(req.team._id);
    if (!team) {
      return res.status(404).json({ msg: "Team not found" });
    }

    if (!team.round2 || !Array.isArray(team.round2.actionCardsUsed)) {
      return res.status(400).json({ msg: "No action cards selected for this team" });
    }

    if (team.round2.totalCardsUsed >= 4) {
      return res.status(400).json({ msg: "Maximum of 4 action cards can be used" });
    }

    const cardEntry = team.round2.actionCardsUsed.find(
      (entry) => entry.cardId.toString() === String(cardId)
    );

    if (!cardEntry) {
      return res.status(400).json({ msg: "This card is not selected for the team" });
    }

    if (cardEntry.usedAt) {
      return res.status(400).json({ msg: "This card has already been used" });
    }

    cardEntry.usedAt = new Date();
    team.round2.totalCardsUsed += 1;

    // Load the full ActionCard document so we know which card/number it is
    const actionCard = await ActionCard.findById(cardEntry.cardId);
    const effectResult = actionCard
      ? applyActionCardEffect(actionCard, { team })
      : { code: "UNKNOWN_CARD", message: "Card not found when applying effect." };

    await team.save();

    res.json({
      msg: "Action card used successfully",
      effect: effectResult,
      round2: team.round2,
      totalScore: team.totalScore
    });
  } catch (err) {
    res.status(500).json({ msg: "Error using action card", error: err.message });
  }
};
