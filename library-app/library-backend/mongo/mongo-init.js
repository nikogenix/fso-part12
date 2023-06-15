db.createUser({
	user: "the_username",
	pwd: "the_password",
	roles: [
		{
			role: "dbOwner",
			db: "the_database",
		},
	],
});

db.createCollection("users");
db.createCollection("authors");
db.createCollection("books");

db.users.insert({ username: "user", favoriteGenre: "genre" }); // password is 'secret' by default
const authorId = db.authors.insert({ name: "name", born: 1970 })._id;
db.books.insert({ title: "book", published: 2023, author: authorId, genres: ["genre"] });
