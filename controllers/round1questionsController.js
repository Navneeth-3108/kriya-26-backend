import Round1Question from "../models/round1questions.js";

export const createRound1Question = async (req, res) => {
  try {
    const { seaNumber, qType, questionText, options, correctAnswer, algorithmCardId, timeLimitSec } = req.body;

    if (!questionText || !options || !correctAnswer) {
      return res.status(400).json({ msg: "questionText, options, and correctAnswer are required" });
    }
    if (!options.includes(correctAnswer)) {
      return res.status(400).json({ msg: "Correct answer must be one of the options" });
    }

    const question = new Round1Question({ seaNumber, qType, questionText, options, correctAnswer, algorithmCardId, timeLimitSec });
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(400).json({ msg: "Error creating Round1 question", error: err.message });
  }
};



export const getRound1Questions = async (_req, res) => {
  try {
    const questions = await Round1Question.find();
    res.json(questions);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching Round1 questions", error: err.message });
  }
};

export const getRound1Question = async (req, res) => {
  try {
    const question = await Round1Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching Round1 question", error: err.message });
  }
};

export const updateRound1Question = async (req, res) => {
  try {
    const question = await Round1Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ msg: "Error updating Round1 question", error: err.message });
  }
};

export const deleteRound1Question = async (req, res) => {
  try {
    const question = await Round1Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json({ msg: "Round1 question deleted" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting Round1 question", error: err.message });
  }
};
