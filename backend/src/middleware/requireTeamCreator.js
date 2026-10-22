
const { Team } = require("../models/models.js");

async function requireTeamCreator(req, res, next) {
  try {
    const team = await Team.findById(req.params.teamId);

    if (!team) {
      return res.status(404).json({
        message: "Team not found",
      });
    }

    // Check whether the logged-in user created this team.
    if (team.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Only the team creator can manage its tasks and members",
      });
    }

    // Pass the team along so the controller can reuse it.
    req.team = team;
    next();
  } catch (error) {
    next(error);
  }
}

module.exports = requireTeamCreator;
