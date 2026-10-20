
const {
  getAllTeams, getTeam, createTeam, updateTeam, deleteTeam,
  getAllMembers, addMember,
  getAllTasks, createTask, getTask, updateTask, deleteTask,
} = require("../controllers/controllers.js");
const express = require("express");
const router = express.Router();

// team
router.get("/", getAllTeams)

router.get("/:teamId", getTeam)
router.post("/", createTeam)
router.put("/:teamId", updateTeam)
router.delete("/:teamId", deleteTeam)

// member
router.get("/:teamId/members", getAllMembers)
router.post("/:teamId/members", addMember)

// task
router.get("/:teamId/tasks", getAllTasks)
router.post("/:teamId/tasks", createTask)

router.get("/:teamId/tasks/:taskId", getTask)
router.put("/:teamId/tasks/:taskId", updateTask)
router.delete("/:teamId/tasks/:taskId", deleteTask)

module.exports = router;