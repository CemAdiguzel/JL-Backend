import { AuthenticationError, gql } from "apollo-server-express";
import { Question } from "../../entities/Question";
import { Exam } from "../../entities/Exam";
import { Answers } from "../../entities/Answer";

const typeDefs = gql`
  type Question {
    id: ID!
    questionDesc: String!
    answer: String!
    grade: String!
    gradingInput: String!
    gradingOutput: String!
    autoGrade: Boolean!
    answers: [Answers]
  }
  type Exam {
    id: ID!
    title: String!
    description: String!
    type: String!
    date: String!
    time: String!
    dueDate: String!
    dueTime: String!
    duration: String!
    gradeScale: String!
    resubmissionNumber: String!
    resubmissionTime: String!
    resubmissionDate: String!
    status: Boolean!
    questions: [Question]
  }
  type Assignment {
    id: ID!
    title: String!
    description: String!
    type: String!
    date: String!
    dueDate: String!
    dueTime: String!
    duration: String!
    gradeScale: String!
    resubmissionNumber: String!
    resubmissionTime: String!
    resubmissionDate: String!
    status: Boolean!
    questions: [Question]
  }
  type Answers {
    id: ID!
    questionId: ID!
    userId: ID!
    answer: String!
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
    assignAnswerToQuestion(questionId: ID!, answerId: ID!): Question
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
      {
        id,
        questionDesc,
        answer,
        grade,
        gradingInput,
        gradingOutput,
        autoGrade,
      },
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
      return;
    },
    assignAnswerToQuestion: async (_, { questionId, answerId }, context) => {
      const question = await Question.findOne({
        where: {
          id: questionId,
        },
        relations: ["answers"],
      });
      if (!question) {
        throw new Error("Question not found");
      }
      const answer = await Answers.findOne({ id: answerId });
      if (!answer) {
        throw new Error("Answer not found2");
      }
      question.answers.push(answer);
      await question.save();
      return question;
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
      const questions = await Question.find({
        relations: ["answers"],
      });
      return questions;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
