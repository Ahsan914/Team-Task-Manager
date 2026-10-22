
const requireAuth = require("../middleware/authMiddleware.js");
const {
  getAllTeams, getTeam, createTeam, updateTeam, deleteTeam,
  getAllMembers, addMembers,
  getAllTasks, createTask, getTask, updateTask, deleteTask,
} = require("../controllers/controllers.js");

const requireTeamCreator = require("../middleware/requireTeamCreator.js");
const express = require("express");
const router = express.Router();

// team
router.get("/", requireAuth, getAllTeams)
router.get("/:teamId", requireAuth, getTeam)

router.post("/", requireAuth, createTeam)
router.put("/:teamId", requireAuth, requireTeamCreator, updateTeam)
router.delete("/:teamId", requireAuth, requireTeamCreator, deleteTeam)

// member
router.get("/:teamId/members", requireAuth, getAllMembers)
router.post("/:teamId/members", requireAuth, requireTeamCreator, addMembers)

// task
router.get("/:teamId/tasks", requireAuth, getAllTasks)
router.post("/:teamId/tasks", requireAuth, requireTeamCreator, createTask)

router.get("/:teamId/tasks/:taskId", requireAuth, getTask)
router.put("/:teamId/tasks/:taskId", requireAuth, requireTeamCreator, updateTask)
router.delete("/:teamId/tasks/:taskId", requireAuth, requireTeamCreator, deleteTask)

module.exports = router;