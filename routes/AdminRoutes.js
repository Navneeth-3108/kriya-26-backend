import { Router } from "express";
import * as adminController from "../controllers/AdminController.js";
import * as AlgorithmCardController from "../controllers/AlgorithmCardController.js";
import * as round1questionsController from "../controllers/round1questionsController.js";
import * as round2questionsController from "../controllers/round2questionsController.js";
import * as leaderboardController from "../controllers/leaderboardController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import * as teamController from "../controllers/teamController.js";

const router = Router();

// Admin routes
router.post("/register", adminController.register);
router.post("/login", adminController.login);
router.post("/logout", authMiddleware, adminController.logout);

// Algorithm card routes
router.post("/algorithmcard", authMiddleware, AlgorithmCardController.createCard);
router.put("/algorithmcard/:id", authMiddleware, AlgorithmCardController.updateCard);
router.delete("/algorithmcard/:id", authMiddleware, AlgorithmCardController.deleteCard);
router.get("/algorithmcard", authMiddleware, AlgorithmCardController.getCards);
router.get("/algorithmcard/:id", authMiddleware, AlgorithmCardController.getCard);
// Round1 routes
router.post("/round1/questions", authMiddleware, round1questionsController.createRound1Question);
router.put("/round1/questions/:id", authMiddleware, round1questionsController.updateRound1Question);
router.delete("/round1/questions/:id", authMiddleware, round1questionsController.deleteRound1Question);
router.get("/round1/questions", authMiddleware, round1questionsController.getRound1Questions);
router.get("/round1/questions/:id", authMiddleware, round1questionsController.getRound1Question);


//Round2 routes

router.post("/round2/questions", authMiddleware, round2questionsController.createRound2Question);
router.put("/round2/questions/:id", authMiddleware, round2questionsController.updateRound2Question);
router.delete("/round2/questions/:id", authMiddleware, round2questionsController.deleteRound2Question);
router.get("/round2/questions", authMiddleware, round2questionsController.getRound2Questions);
router.get("/round2/questions/:id", authMiddleware, round2questionsController.getRound2Question);

// Leaderboard routes
router.get("/leaderboard", authMiddleware, leaderboardController.getLeaderboard);
router.get("/leaderboard/teams/:id", authMiddleware, leaderboardController.getTeamLeaderboard);
router.post("/leaderboard/adjust", authMiddleware, leaderboardController.adjustScore);

// Team routes
router.get("/teams", authMiddleware, teamController.getTeams);
router.get("/teams/:id", authMiddleware, teamController.getTeam);
router.post("/teams", authMiddleware, teamController.createTeam);
router.put("/teams/:id", authMiddleware, teamController.updateTeam);
router.delete("/teams/:id", authMiddleware, teamController.deleteTeam);

export default router;