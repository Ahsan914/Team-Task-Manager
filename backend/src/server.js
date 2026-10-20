
const path = require("path");
const dns = require('node:dns');
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

// const connectDB = require("./config/db.js");
const router = require("./routes/routes.js");

const app = express();
app.use(express.json()); //parse json body
app.use("/api/teams", router);

if(process.env.NODE_ENV !== "production"){
	app.use(
		cors({origin: "http://localhost:5173"})
	);
}

if(process.env.NODE_ENV == "production"){
	// commonJS already has __dirname which is based on location of serverjs
	app.use(express.static( path.join(__dirname, "../../Frontend/dist") ));

	app.get(/.*/, (req, res) => {
		res.sendFile( path.join(__dirname, "../../Frontend/dist/index.html") )
	});
}

dns.setServers(['1.1.1.1', '8.8.8.8']);
const PORT = process.env.PORT || 3000;

// connectDB().then( () => {
// 	app.listen(PORT, () => {
// 		console.log("server started on port: ", PORT);
// 	});
// });


app.listen(PORT, () => {
	console.log("server started on port: ", PORT);
});


