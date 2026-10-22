
const { User, Team, Task } = require("../models/models.js");

async function getAllTeams(req, res) {
	try{
		const teams = await Team.find().sort({createdAt: -1}).populate("creator", "name email").populate("members", "name email");
		res.status(200).json(teams);
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function getTeam(req, res) {
	try{
		const team = await Team.findById(req.params.teamId).populate("creator", "name email").populate("members", "name email");

		if(!team) return res.status(404).json({message: "Team not found"});
		res.status(200).json(team);

	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}

async function createTeam(req, res) {
  try {
    const { name, description } = req.body;

    const team = new Team({
      name,
      description,
      creator: req.user._id,
    });

    const savedTeam = await team.save();
    res.status(201).json(savedTeam);
  } catch (error) {
    console.error("internal server error: ", error);
    res.status(500).json({ message: "internal server error" });
  }
}

async function updateTeam(req, res) {
	try{
		const {name, description} = req.body;
		const updatedTeam = await Team.findByIdAndUpdate(
			req.params.teamId, {name, description}, {returnDocument: "after"}
		);

		if(!updatedTeam) return res.status(404).json({message: "Team not found"});
		res.status(200).json(updatedTeam);
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}

async function deleteTeam(req, res) {
	try{
		
		const team = await Team.findById(req.params.teamId);
		if (!team) {
			return res.status(404).json({
				message: "Team not found"
			});
		}

		await Task.deleteMany({ team: team._id });
		await Team.findByIdAndDelete(team._id);

		res.status(200).json({message: "Team deleted successfully"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}

async function getAllMembers(req, res) {
	try{
		const team = await Team.findById(req.params.teamId).populate({ 
			path: "members", 
			select: "name email", 
			options: { sort: { name: 1 } } 
		});
		
		if(!team) return res.status(404).json({message: "Team not found"});
		res.status(200).json(team.members);
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function addMembers(req, res) {
	try{
		const {userIds} = req.body;
		const updatedTeam = await Team.findByIdAndUpdate(
			req.team._id, 
			{ $addToSet: { members: {$each: userIds} } }, 
			{returnDocument: "after", runValidators: true}
		);

		if(!updatedTeam) return res.status(404).json({message: "Team not found"});
		res.status(201).json(updatedTeam);
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}

async function getAllTasks(req, res) {
	try{
		const tasks = await Task.find({team: req.params.teamId}).populate("assignedTo", "name email").sort({createdAt: -1});
		res.status(200).json(tasks);
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}

async function createTask(req, res) {
  try {
    const { 
		name, 
		description, 
		dueDate, 
		assignedTo, 
		status 
	} = req.body;

    const allowedStatuses = ["todo", "in-progress", "completed"];

    if (status && !allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const userIds = assignedTo || [];

    if (!Array.isArray(userIds)) {
      return res.status(400).json({
        message: "assignedTo must be an array of user IDs",
      });
    }

    const team = await Team.findById(req.team._id);

    const members = team.members.map((id) => id.toString());

    const invalidMembers = userIds.some(
      (id) => !members.includes(id.toString())
    );

    if (invalidMembers) {
      return res.status(400).json({
        message: "Tasks can only be assigned to team members",
      });
    }

    if (dueDate && isNaN(Date.parse(dueDate))) {
      return res.status(400).json({
        message: "Invalid due date",
      });
    }

    const task = new Task({
      name,
      description,
      dueDate: dueDate || null,
      assignedTo: userIds,
      status: status,
      team: req.team._id,
    });

    const savedTask = await task.save();
    res.status(201).json(savedTask);

} catch (error) {
    console.error("internal server error: ", error);

    res.status(500).json({
      message: "internal server error",
    });
  }
}

async function getTask(req, res) {
	try{
		const task = await Task.findOne({
			_id: req.params.taskId,
			team: req.params.teamId
		}).populate("assignedTo", "name email");

		if(!task) return res.status(404).json({message: "Task not found"});
		res.status(200).json(task);
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}

async function updateTask(req, res) {
  try {
    const { name, description, dueDate, assignedTo, status } = req.body;

    const allowedStatuses = ["todo", "in-progress", "completed"];

    if ( status && !allowedStatuses.includes(status) ) {
      return res.status(400).json({
        message: "Invalid task status",
      });
    }

    const task = await Task.findOne({
      _id: req.params.taskId,
      team: req.team._id,
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (name) task.name = name;
    if (description) task.description = description;

    if (dueDate) {
      if (dueDate && isNaN(Date.parse(dueDate))) {
        return res.status(400).json({
          message: "Invalid due date",
        });
      }

      task.dueDate = dueDate || null;
    }

    if (status) {
      task.status = status;
    }

    if (assignedTo) {
      if (!Array.isArray(assignedTo)) {
        return res.status(400).json({
          message: "assignedTo must be an array of user IDs",
        });
      }

      const team = await Team.findById(req.team._id);

      const members = team.members.map((id) => id.toString());

      const invalidMembers = assignedTo.some(
        (id) => !members.includes(id.toString())
      );

      if (invalidMembers) {
        return res.status(400).json({
          message: "Tasks can only be assigned to team members",
        });
      }

      task.assignedTo = assignedTo;
    }

    const updatedTask = await task.save();

    res.status(200).json(updatedTask);
  } catch (error) {
    console.error("internal server error: ", error);

    res.status(500).json({
      message: "internal server error",
    });
  }
}

async function deleteTask(req, res) {
	try{
		const task = await Task.findOneAndDelete({
			_id: req.params.taskId,
			team: req.team._id
		});

		if(!task) return res.status(404).json({message: "Task not found"});
		res.status(200).json({message: "Task deleted successfully"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}


module.exports = {
	getAllTeams, getTeam, createTeam, updateTeam, deleteTeam,
	getAllMembers, addMembers, 
	getAllTasks, createTask, getTask, updateTask, deleteTask
};
