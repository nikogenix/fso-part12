require("dotenv").config();

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Author = require("./models/Author");
const Book = require("./models/Book");
const User = require("./models/User");

const MONGO_URL =
	process.env.MONGO_URL ||
	process.env.MONGODB_URI ||
	"mongodb://the_username:the_password@localhost:3456/the_database";

console.log("connecting to", MONGO_URL);

if (MONGO_URL && !mongoose.connection.readyState)
	mongoose
		.connect(MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true })
		.then(() => {
			console.log("connected to MongoDB");
		})
		.catch((error) => {
			console.log("error connection to MongoDB:", error.message);
		});

module.exports = {
	Author,
	Book,
	User,
};
