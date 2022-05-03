import { gql } from "apollo-server-express";
import GraphQLJSON from "graphql-type-json";
import { getRepository } from "typeorm";

const typeDefs = gql`
  scalar JSON

  type Query {
    _: String!
  }

  type Mutation {
    _: String!
    deleteEntities(ids: [String!], modelName: String!): Boolean
  }

  type Subscription {
    _: String!
  }
`;

const resolvers = {
  JSON: GraphQLJSON,
  Mutation: {
    deleteEntities: async (_, { ids, modelName }, context) => {
      const user = context.user;
      const repo = getRepository(modelName);
      await repo.delete(ids);
      return true;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
