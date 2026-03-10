import { Router } from "express";
import { teamAuthMiddleware } from "../middleware/authMiddleware.js";
import { selectActionCards, useActionCard } from "../controllers/teamController.js";

const router = Router();

router.post("/select-action-cards", teamAuthMiddleware, selectActionCards);
router.post("/use-action-card", teamAuthMiddleware, useActionCard);

export default router;

