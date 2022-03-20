import { ApolloServer } from "apollo-server-express";
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from "graphql-ws/lib/use/ws";
import { WebSocketServer } from "ws";
import express from "express";
import jwt from "jsonwebtoken";

import typeDefs from "./typeDefs.js";
import resolvers from "./resolvers.js";

const app = express();

const context = ({ req }) => {
  const { authorization } = req.headers;
  if (authorization) {
    const { userId } = jwt.verify(authorization, process.env.JWT_SECRET);
    return { userId };
  }
};

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

const apolloServer = new ApolloServer({ schema, context });
await apolloServer.start();
apolloServer.applyMiddleware({ app, path: "/graphql" });

const server = app.listen(4000, () => {
  // Create & use websocket server
  const wsServer = new WebSocketServer({
    server,
    path: "/graphql",
  });
  useServer({ schema }, wsServer);
  console.log("Apollo and Subscription server is up...");
});
