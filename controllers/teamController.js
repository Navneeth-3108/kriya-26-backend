import Team from "../models/Team.js";

/**
 * Get all teams
 */
export const getTeams = async (_req, res) => {
  try {
    const teams = await Team.find();
    res.json(teams);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching teams", error: err });
  }
};

/**
 * Get a single team by ID
 */
export const getTeam = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching team", error: err });
  }
};

/**
 * Create a new team
 */

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


/**
 * Update an existing team
 */
export const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json(team);
  } catch (err) {
    res.status(400).json({ msg: "Error updating team", error: err });
  }
};

/**
 * Delete a team
 */
export const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);
    if (!team) return res.status(404).json({ msg: "Team not found" });
    res.json({ msg: "Team deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Error deleting team", error: err });
  }
};
