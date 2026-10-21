
const requireAuth = require("../middleware/authMiddleware.js");
const {
  getAllTeams, getTeam, createTeam, updateTeam, deleteTeam,
  getAllMembers, addMembers,
  getAllTasks, createTask, getTask, updateTask, deleteTask,
} = require("../controllers/controllers.js");
const express = require("express");
const router = express.Router();

// team
router.get("/", requireAuth, getAllTeams)

router.get("/:teamId", requireAuth, getTeam)
router.post("/", requireAuth, createTeam)
router.put("/:teamId", requireAuth, updateTeam)
router.delete("/:teamId", requireAuth, deleteTeam)

// member
router.get("/:teamId/members", requireAuth, getAllMembers)
router.post("/:teamId/members", requireAuth, addMembers)

// task
router.get("/:teamId/tasks", requireAuth, getAllTasks)
router.post("/:teamId/tasks", requireAuth, createTask)

router.get("/:teamId/tasks/:taskId", requireAuth, getTask)
router.put("/:teamId/tasks/:taskId", requireAuth, updateTask)
router.delete("/:teamId/tasks/:taskId", requireAuth, deleteTask)

module.exports = router;