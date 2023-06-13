const express = require("express");
const { Todo } = require("../mongo");
const router = express.Router();
const redis = require("../redis");

/* GET todos listing. */
router.get("/", async (_, res) => {
	const todos = await Todo.find({});
	res.send(todos);
});

/* POST todo to listing. */
router.post("/", async (req, res) => {
	const todo = await Todo.create({
		text: req.body.text,
		done: false,
	});

	const current_added = await redis.getAsync("added_todos");
	redis.setAsync("added_todos", current_added ? Number(current_added) + 1 : 1);

	res.send(todo);
});

const singleRouter = express.Router();

const findByIdMiddleware = async (req, res, next) => {
	const { id } = req.params;
	req.todo = await Todo.findById(id);
	if (!req.todo) return res.sendStatus(404);

	next();
};

/* DELETE todo. */
singleRouter.delete("/", async (req, res) => {
	await req.todo.delete();
	res.sendStatus(200);
});

/* GET todo. */
singleRouter.get("/", async (req, res) => {
	res.send(req.todo);
});

/* PUT todo. */
singleRouter.put("/", async (req, res) => {
	const { text, done } = req.body;
	try {
		const todo = await Todo.findByIdAndUpdate(req.todo.id, { text, done }, { new: true });
		if (!todo) {
			return res.sendStatus(404);
		}
		res.send(todo);
	} catch (error) {
		console.error(error);
		res.sendStatus(500);
	}
});

router.use("/:id", findByIdMiddleware, singleRouter);

module.exports = router;
