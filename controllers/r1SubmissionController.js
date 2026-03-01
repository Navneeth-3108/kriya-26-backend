import Round1Question from "../models/round1questions.js";
import Team from "../models/Team.js";

/**
 * Generic controller to handle Round 1 question fetching and score updates.
 * Route: GET /kriyabe/:questionType/:questionNo?kriyaID=...
 */
export const handleSubmission = async (req, res) => {
    try {
        const { questionType, questionNo } = req.params;
        const kriyaID = req.team?.kriyaID || req.query.kriyaID;

        const qNum = parseInt(questionNo);

        // 1. Validate questionNo is 1-6
        if (isNaN(qNum) || qNum < 1 || qNum > 6) {
            console.error(`Invalid question number: ${questionNo}`);
            return res.status(400).json({ msg: "Invalid question number. Must be between 1 and 6." });
        }

        // 2. Fetch question from mongo
        // Use case-insensitive regex for questionType to be flexible
        const question = await Round1Question.findOne({
            questionType: { $regex: new RegExp(`^${questionType}$`, "i") },
            questionNo: qNum
        }).lean();

        // 3. If question is not in mongo then print error
        if (!question) {
            console.error(`Question ${questionType} with number ${qNum} not found in database`);
            return res.status(404).json({ msg: `Question ${questionType.toUpperCase()} ${qNum} not found in database.` });
        }

        // 4. Update team score if kriyaID is provided
        let team = null;
        let scoreUpdateStatus = "No kriyaID provided";

        if (kriyaID) {
            team = await Team.findOne({ kriyaID });
            if (team) {
                const pointsToAdd = question.points || 0;
                team.totalScore = (team.totalScore || 0) + pointsToAdd;
                await team.save();
                scoreUpdateStatus = `Score updated for team ${team.teamName}`;
            } else {
                console.warn(`Team with kriyaID ${kriyaID} not found in database.`);
                scoreUpdateStatus = `Team with kriyaID ${kriyaID} not found`;
            }
        }

        res.json({
            success: true,
            message: scoreUpdateStatus,
            question: {
                questionType: question.questionType,
                questionNo: question.questionNo,
                question: question.question,
                points: question.points || 0
            },
            team: team ? {
                teamName: team.teamName,
                totalScore: team.totalScore
            } : null
        });

    } catch (err) {
        console.error("Error in generic submission controller:", err.message);
        res.status(500).json({ msg: "Internal server error", error: err.message });
    }
};

/**
 * Controller to verify answer and update score.
 * Route: GET /kriyabe/:questionType/:questionNo/:answer?kriyaID=...
 */
export const verifyAnswer = async (req, res) => {
    try {
        const { questionType, questionNo, answer: userRoutesAnswer } = req.params;
        const kriyaID = req.team?.kriyaID || req.query.kriyaID;

        const qNum = parseInt(questionNo);

        // 1. Validate questionNo is 1-6
        if (isNaN(qNum) || qNum < 1 || qNum > 6) {
            return res.status(400).json({ msg: "Invalid question number. Must be between 1 and 6." });
        }

        // 2. Fetch question from mongo
        const question = await Round1Question.findOne({
            questionType: { $regex: new RegExp(`^${questionType}$`, "i") },
            questionNo: qNum
        }).lean();

        if (!question) {
            return res.status(404).json({ msg: `Question ${questionType.toUpperCase()} ${qNum} not found.` });
        }

        // 3. Verify answer (case-insensitive)
        const isCorrect = question.answer.trim().toLowerCase() === userRoutesAnswer.trim().toLowerCase();

        if (!isCorrect) {
            return res.status(200).json({
                success: false,
                msg: "Wrong answer",
                correct: false
            });
        }

        // 4. Update team score if kriyaID is provided
        let team = null;
        let scoreMessage = "Answer correct!";

        if (kriyaID) {
            team = await Team.findOne({ kriyaID });
            if (team) {
                const pointsToAdd = question.points || 0;
                team.totalScore = (team.totalScore || 0) + pointsToAdd;
                await team.save();
                scoreMessage = `Correct answer! ${pointsToAdd} points have been added.`;
            } else {
                scoreMessage = "Correct answer! (Team not found, score not updated)";
            }
        }

        res.json({
            success: true,
            msg: scoreMessage,
            correct: true,
            points: question.points || 0,
            teamSummary: team ? {
                teamName: team.teamName,
                totalScore: team.totalScore
            } : null
        });

    } catch (err) {
        console.error("Error in verifyAnswer controller:", err.message);
        res.status(500).json({ msg: "Internal server error", error: err.message });
    }
};
