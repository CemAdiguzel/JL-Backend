import { ApolloServer } from "apollo-server-express";
import { merge } from "lodash";
import { typeDefs as directiveTypes, directiveTransformer } from "./directives";
import { typeDefs as BaseTypes, resolvers as BaseResolvers } from "./base";
import { typeDefs as AuthTypes, resolvers as AuthResolvers } from "./auth";
import {
  typeDefs as RoadmapTypes,
  resolvers as RoadmapResolvers,
} from "./roadmap";
import {
  typeDefs as ContentTypes,
  resolvers as ContentResolvers,
} from "./content";
import {
  typeDefs as ProgressionTypes,
  resolvers as ProgressionResolvers,
} from "./progression";
import { typeDefs as ExamTypes, resolvers as ExamResolvers } from "./exam";

import { makeExecutableSchema } from "@graphql-tools/schema";

const resolvers = {};

export const schema = directiveTransformer(
  makeExecutableSchema({
    typeDefs: [
      directiveTypes,
      BaseTypes,
      AuthTypes,
      RoadmapTypes,
      ContentTypes,
      ProgressionTypes,
      ExamTypes,
    ],
    resolvers: merge(
      resolvers,
      BaseResolvers,
      AuthResolvers,
      RoadmapResolvers,
      ContentResolvers,
      ProgressionResolvers,
      ExamResolvers
    ),
  })
);

const apolloServer = new ApolloServer({
  playground: true,
  introspection: true,
  schema,
  context: ({ req, connection, ...rest }) => {
    return {
      user: req?.user
        ? req.user
        : connection?.context?.user
        ? connection.context.user
        : null,
      dbConnection: req?.dbConnection || null,
      connection,
    };
  },
});

module.exports.apolloServer = apolloServer;
