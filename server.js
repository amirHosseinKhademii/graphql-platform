const mongoose = require("mongoose");
const { importSchema } = require("graphql-import");
const path = require("path");
const config = require("config");
const { ApolloServer, PubSub } = require("apollo-server");

const port = process.env.PORT || 5000;
const pubsub = new PubSub();
// initial server
const typeDefs = importSchema(path.join(__dirname, `./graphql/types.graphql`));
const resolvers = require("./graphql/resolvers");
const server = new ApolloServer({
  cors: true,
  typeDefs,
  resolvers,
  context: ({ req, res }) => ({ req, res, pubsub }),
});
// connect to mdb
const uri = config.get("mdb");
mongoose
  .connect(uri, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    return server.listen({ port });
  })
  .then((res) => {
    console.log(`server on ${res.url} connected to MDB`);
  })
  .catch((er) => {
    console.error(er);
  });
