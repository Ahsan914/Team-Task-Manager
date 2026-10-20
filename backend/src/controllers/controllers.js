

async function getAllTeams(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "getAllTeams"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function getTeam(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "getTeam"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function createTeam(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "createTeam"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function updateTeam(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "updateTeam"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function deleteTeam(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "deleteTeam"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function getAllMembers(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "getAllMembers"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function addMember(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "addMember"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function getAllTasks(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "getAllTasks"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function createTask(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "createTask"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function getTask(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "getTask"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function updateTask(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "updateTask"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}
async function deleteTask(req, res) {
	try{
		// const note = await Note.findById(req.params.id);

		// if(!note) return res.status(404).json({message: "Note not found"});
		// res.status(200).json(note);
		res.status(200).json({message: "deleteTask"});
	
	}catch(error){
		console.error("internal server error: ", error)
		res.status(500).json({message: "internal server error"})
	}
}


module.exports = {
	getAllTeams, getTeam, createTeam, updateTeam, deleteTeam,
	getAllMembers, addMember, 
	getAllTasks, createTask, getTask, updateTask, deleteTask
};
