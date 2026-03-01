import { Router } from "express";
import { handleSubmission, verifyAnswer } from "../controllers/r1SubmissionController.js";

const router = Router();

// Generic endpoint for question fetching and scoring
router.get("/:questionType/:questionNo", handleSubmission);

// Generic endpoint for answer verification and scoring
router.get("/:questionType/:questionNo/:answer", verifyAnswer);

export default router;
