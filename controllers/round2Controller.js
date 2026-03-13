import Algorithm from "../models/AlgorithmCard.js";
import Round2Question from "../models/round2questions.js";

export const generateRound2Questions = async (req, res) => {

  try {

    const { selectedScrolls } = req.body;

    console.log("Received Scrolls:", selectedScrolls);

    if (!selectedScrolls || selectedScrolls.length !== 3) {
      return res.status(400).json({
        message: "Exactly 3 scrolls must be selected"
      });
    }

    const islandQuestions = [];

    for (let i = 0; i < selectedScrolls.length; i++) {

      const scroll = selectedScrolls[i];

      const algo = await Algorithm.findOne({ name: scroll.name });

      if (!algo) {
        return res.status(404).json({
          message: `Algorithm ${scroll.name} not found`
        });
      }

      const index = scroll.questionNo - 1;

      if (index < 0 || index >= algo.questions.length) {
        return res.status(400).json({
          message: `Invalid question number for ${scroll.name}`
        });
      }

      const questionId = algo.questions[index];

      const question = await Round2Question.findById(questionId);

      if (!question) {
        return res.status(404).json({
          message: "Question not found"
        });
      }

      islandQuestions.push({
        island: `ISLAND${i + 1}`,
        question
      });
    }

    console.log("Generated Questions:", islandQuestions);

    res.json({
      islandQuestions
    });

  } catch (error) {

    console.error(error);
    res.status(500).json({
      message: "Server error"
    });

  }

};