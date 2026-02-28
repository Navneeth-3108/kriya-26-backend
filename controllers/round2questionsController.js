import Round2Question from "../models/round2questions.js";

export const createRound2Question = async (req, res) => {
  try {
    const { title, description, allowedAlgorithms, timeLimitSec, testCases, createdBy } = req.body;

    if (!title || !description || !testCases || testCases.length === 0) {
      return res.status(400).json({ msg: "title, description, and at least one testCase are required" });
    }

    const question = new Round2Question({ title, description, allowedAlgorithms, timeLimitSec, code: req.body.code, testCases, createdBy });
    await question.save();
    res.json(question);
  } catch (err) {
    res.status(400).json({ msg: "Error creating Round2 question", error: err.message });
  }
};



// Get all Round2 questions
export const getRound2Questions = async (_req, res) => {
  try {
    const questions = await Round2Question.find();
    res.json(questions);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching Round2 questions", error: err });
  }
};

// Get a single Round2 question by ID
export const getRound2Question = async (req, res) => {
  try {
    const question = await Round2Question.findById(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ msg: "Error fetching Round2 question", error: err });
  }
};

// Update a Round2 question
export const updateRound2Question = async (req, res) => {
  try {
    const question = await Round2Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json(question);
  } catch (err) {
    res.status(400).json({ msg: "Error updating Round2 question", error: err });
  }
};

// Delete a Round2 question
export const deleteRound2Question = async (req, res) => {
  try {
    const question = await Round2Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ msg: "Question not found" });
    res.json({ msg: "Round2 question deleted" });
  } catch (err) {
    res.status(400).json({ msg: "Error deleting Round2 question", error: err });
  }
};
