import { AuthenticationError, gql } from "apollo-server-express";
import { Question } from "../../entities/Question";

const typeDefs = gql`
  type Question {
    id: ID!
    questionDesc: String!
    answer: String!
    grade: String!
    gradingInput: String!
    gradingOutput: String!
    autoGrade: Boolean!
  }

  extend type Mutation {
    createQuestion(
      questionDesc: String!
      answer: String!
      grade: String!
      gradingInput: String!
      gradingOutput: String!
      autoGrade: Boolean!
    ): Question

    updateQuestion(
      id: ID!
      questionDesc: String!
      answer: String!
      grade: String!
      gradingInput: String!
      gradingOutput: String!
      autoGrade: Boolean!
    ): Question

    deleteQuestion(id: ID!): Question

    assignedQuestionToExam(examId: ID!, userIds: [ID!]!): Question
  }

  extend type Query {
    getQuestion(id: ID!): Question!
    getQuestions: [Question]
  }
`;

const resolvers = {
  Mutation: {
    createQuestion: async (
      _,
      { questionDesc, answer, grade, gradingInput, gradingOutput, autoGrade },
      context
    ) => {
      const question = new Question();
      question.questionDesc = questionDesc;
      question.answer = answer;
      question.grade = grade;
      question.gradingInput = gradingInput;
      question.gradingOutput = gradingOutput;
      question.autoGrade = autoGrade;
      await question.save();
      return question;
    },
    updateQuestion: async (
      _,
      { id, questionDesc, answer, grade, gradingInput, gradingOutput, autoGrade },
      context
    ) => {
      const question = await Question.findOne({ id });
      if (!question) {
        throw new Error("Question not found");
      }
      question.questionDesc = questionDesc;
      question.answer = answer;
      question.grade = grade;
      question.gradingInput = gradingInput;
      question.gradingOutput = gradingOutput;
      question.autoGrade = autoGrade;
      await question.save();
      return question;
    },
    deleteQuestion: async (_, { id }, context) => {
      const question = await Question.findOne({ id });
      if (!question) {
        throw new Error("Question not found");
      }
      await question.remove();
      return question;
    },
    assignedQuestionToExam: async (_, { examId, questionIds }, context) => {
      const exam = await Exam.findOne({ id: examId });
      if (!exam) {
        throw new Error("Exam not found");
      }
      const questions = await Question.find({ id: questionIds });
      if (!questions) {
        throw new Error("Question not found");
      }
      exam.questions = questions;
      await exam.save();
      return exam;
    },
  },
  Query: {
    getQuestion: async (_, { id }, context) => {
      const question = await Question.findOne({ id });
      if (!question) {
        throw new Error("Question not found");
      }
      return question;
    },
    getQuestions: async (_, __, context) => {
      const questions = await Question.find();
      return questions;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
