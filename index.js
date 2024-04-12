const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const db = require("./db");
//types
const typeDefs = require("./schema");
//server setup

const resolvers = {
  Query: {
    games() {
      return db.games;
    },
    authors() {
      return db.authors;
    },
    reviews() {
      return db.reviews;
    },
    review(_, args) {
      return db.reviews.find((review) => review.id == args.id);
    },
    author(_, args) {
      return db.authors.find((author) => author.id == args.id);
    },
    game(_, args) {
      return db.games.find((game) => game.id == args.id);
    },
  },
  Game: {
    reviews(parent) {
      return db.reviews.filter((r) => r.game_id === parent.id);
    },
  },
  Author: {
    reviews(parent) {
      return db.reviews.filter((review) => review.author_id === parent.id);
    },
  },
  Review: {
    author(parent) {
      return db.authors.find((author) => author.id == parent.author_id);
    },
    game(parent) {
      return db.games.find((game) => game.id == parent.game_id);
    },
  },
  Mutation: {
    deleteGame(_, args) {
      db.games = db.games.filter((g) => g.id !== args.id);
      return db.games;
    },
    addGame(_, args) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 1000).toString(),
      };
      db.games.push(game);
      return game;
    },
    editGame(_, args) {
      db.games = db.games.map((game) => {
        if (game.id == args.id) {
          return { ...game, ...args.edits };
        }
        return game;
      });
      return db.games.find((game) => game.id == args.id);
    },
  },
};
const server = new ApolloServer({ typeDefs, resolvers });
const { url } = startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log("server ready at port", 4000);
