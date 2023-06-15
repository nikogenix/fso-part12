const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@apollo/server/express4");
const { ApolloServerPluginDrainHttpServer } = require("@apollo/server/plugin/drainHttpServer");
const { makeExecutableSchema } = require("@graphql-tools/schema");
const express = require("express");
const cors = require("cors");
const http = require("http");

const { WebSocketServer } = require("ws");
const { useServer } = require("graphql-ws/lib/use/ws");

const jwt = require("jsonwebtoken");

const { User } = require("./mongo");

const typeDefs = require("./schema");
const resolvers = require("./resolvers");

require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const start = async () => {
	const app = express();
	const httpServer = http.createServer(app);

	const wsServer = new WebSocketServer({
		server: httpServer,
		path: "/",
	});

	const schema = makeExecutableSchema({ typeDefs, resolvers });
	const serverCleanup = useServer({ schema }, wsServer);

	const server = new ApolloServer({
		schema,
		plugins: [
			ApolloServerPluginDrainHttpServer({ httpServer }),
			{
				async serverWillStart() {
					return {
						async drainServer() {
							await serverCleanup.dispose();
						},
					};
				},
			},
		],
	});

	await server.start();

	app.use(
		"/",
		cors(),
		express.json(),
		expressMiddleware(server, {
			context: async ({ req }) => {
				const auth = req ? req.headers.authorization : null;
				if (auth && auth.startsWith("Bearer ")) {
					const decodedToken = jwt.verify(auth.substring(7), JWT_SECRET);
					const currentUser = await User.findById(decodedToken.id);
					return { currentUser };
				}
			},
		})
	);

	const PORT = process.env.PORT || 4000;

	httpServer.listen(PORT, () => console.log(`server is now running at http://localhost:${PORT}`));
};

start();
