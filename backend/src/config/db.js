
const mongoose = require("mongoose");

async function connectDB(){
	try{
		await mongoose.connect(process.env.MONGO_URI);
		console.log("mongodb connected successfully!");
	}catch(error){
		console.log("Error connecting to mongodb: ", error);
		process.exit(1);
	}
}

module.exports = connectDB;