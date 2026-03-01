import { Router } from "express";
import { handleSubmission, verifyAnswer } from "../controllers/r1SubmissionController.js";
import { teamAuthMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

// Generic endpoint for question fetching and scoring
router.get("/:questionType/:questionNo", teamAuthMiddleware, handleSubmission);

// Generic endpoint for answer verification and scoring
router.get("/:questionType/:questionNo/:answer", teamAuthMiddleware, verifyAnswer);

export default router;
