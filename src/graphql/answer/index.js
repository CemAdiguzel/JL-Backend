import { AuthenticationError, gql } from "apollo-server-express";
import { Question } from "../../entities/Question";
import { Answers } from "../../entities/Answer";

const typeDefs = gql`
  type Answers {
    id: ID!
    questionId: ID!
    answer: String!
  }
  type Question {
    id: ID
    questionDesc: String
    answer: String
    grade: String
    gradingInput: String
    gradingOutput: String
    autoGrade: Boolean
    answers: [Answers]
  }

  extend type Mutation {
    createAnswer(questionId: ID!, answer: String!): Answers
  }
  extend type Query {
    getAnswer(id: ID!): Answers
    getAnswers: [Answers]
  }
`;
const resolvers = {
  Mutation: {
    createAnswer: async (_, { questionId, answer }) => {
      const question = await Question.findOne({
        where: {
          id: questionId,
        },
      });
      if (!question) {
        throw new Error("Question not found");
      }
      const answerObj = new Answers();
      answerObj.questionId = questionId;
      answerObj.answer = answer;
      await answerObj.save();
      return answerObj;
    },
  },
  Query: {
    getAnswer: async (_, { id }) => {
      const answer = await Answers.findOne({
        where: {
          id,
        },
      });
      if (!answer) {
        throw new Error("Answer not found1");
      }
      return answer;
    },
    getAnswers: async () => {
      const answers = await Answers.find();
      if (!answers) {
        throw new Error("Answers not found");
      }
      return answers;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
