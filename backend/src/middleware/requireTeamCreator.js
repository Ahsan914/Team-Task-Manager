const { Team } = require("../models/models.js");

async function requireTeamCreator(req, res, next) {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    if (!team.creator || !req.user?._id) {
      return res.status(403).json({
        message: "You are not authorized to manage this team",
      });
    }

    if (team.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team creator can manage this team",
      });
    }

    req.team = team;
    next();
  } catch (error) {
    console.error("requireTeamCreator error:", error);

    return res.status(500).json({
      message: "Internal server error",
    });
  }
}

module.exports = requireTeamCreator;