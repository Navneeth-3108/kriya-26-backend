import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import Team from "../models/Team.js";

export const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check for Bearer token
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure the admin exists
    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ msg: "Admin not found, authorization denied" });
    }

    // Attach admin info to request
    req.admin = admin;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

export const teamAuthMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided, authorization denied" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.id || decoded.role !== "team") {
      return res.status(401).json({ msg: "Token is not valid for team access" });
    }

    const team = await Team.findById(decoded.id);
    if (!team) {
      return res.status(401).json({ msg: "Team not found, authorization denied" });
    }

    req.team = team;
    next();
  } catch (_err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};