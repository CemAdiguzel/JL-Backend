import {
  AuthenticationError,
  gql,
  UserInputError,
} from "apollo-server-express";
import { Assignment } from "../../entities/Assignment";
import { Question } from "../../entities/Question";

const typeDefs = gql`
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

  type Question {
    id: ID!
    question: String!
    answer: String!
    grade: String
    gradingInput: String!
    gradingOutput: String!
    autoGrade: Boolean!
  }

  extend type Mutation {
    createAssignment(
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
    ): Assignment

    updateAssignment(
      id: ID!
      title: String
      description: String
      type: String
      date: String
      dueDate: String
      dueTime: String
      duration: String
      gradeScale: String
      resubmissionNumber: String
      resubmissionTime: String
      resubmissionDate: String
      status: Boolean
    ): Assignment

    deleteAssignment(id: ID!): Assignment

    assignedQuestionToAssignment(AssignmentId: ID!, questionId: ID!): Assignment
  }

  extend type Query {
    getAssignment(id: ID!): Assignment!
    assignmentList: [Assignment!]!
  }
`;

const resolvers = {
  Mutation: {
    createAssignment: async (
      _,
      {
        title,
        description,
        type,
        date,
        dueDate,
        dueTime,
        duration,
        gradeScale,
        resubmissionNumber,
        resubmissionTime,
        resubmissionDate,
        status,
      },
      context
    ) => {
      const assignment = new Assignment();
      assignment.title = title;
      assignment.description = description;
      assignment.type = type;
      assignment.date = date;
      assignment.dueDate = dueDate;
      assignment.dueTime = dueTime;
      assignment.duration = duration;
      assignment.gradeScale = gradeScale;
      assignment.resubmissionNumber = resubmissionNumber;
      assignment.resubmissionTime = resubmissionTime;
      assignment.resubmissionDate = resubmissionDate;
      assignment.status = status;

      await assignment.save();

      return assignment;
    },
    updateAssignment: async (
      _,
      {
        id,
        title,
        description,
        type,
        date,
        time,
        dueDate,
        dueTime,
        duration,
        gradeScale,
        resubmissionNumber,
        resubmissionTime,
        resubmissionDate,
        status,
      },
      context
    ) => {
      const assignment = await Assignment.findOne({ id });
      if (!assignment) {
        throw new AuthenticationError("Exam not found");
      }
      if (title) {
        assignment.title = title;
      }
      if (description) {
        assignment.description = description;
      }
      if (type) {
        assignment.type = type;
      }
      if (date) {
        assignment.date = date;
      }
      if (dueDate) {
        assignment.dueDate = dueDate;
      }
      if (dueTime) {
        assignment.dueTime = dueTime;
      }
      if (duration) {
        assignment.duration = duration;
      }
      if (gradeScale) {
        assignment.gradeScale = gradeScale;
      }
      if (resubmissionNumber) {
        assignment.resubmissionNumber = resubmissionNumber;
      }
      if (resubmissionTime) {
        assignment.resubmissionTime = resubmissionTime;
      }
      if (resubmissionDate) {
        assignment.resubmissionDate = resubmissionDate;
      }
      if (status) {
        assignment.status = status;
      }

      await assignment.save();
      return assignment;
    },
    deleteAssignment: async (_, { id }, context) => {
      const assignment = await Assignment.findOne({ id });
      if (!assignment) {
        throw new AuthenticationError("Assignment not found");
      }
      await assignment.remove();
      return assignment;
    },
    assignedQuestionToAssignment: async (
      _,
      { AssignmentId, questionId },
      context
    ) => {
      const assignment = await Assignment.findOne({
        where: { id: AssignmentId },
        relations: ["questions"],
      });
      if (!assignment) {
        throw new Error("Assignment not found");
      }
      const oldQuestion = assignment.questions;
      console.log("oldQuestion", oldQuestion);

      if (oldQuestion) {
        const newQuestion = await Question.findOne({ id: questionId });
        if (!newQuestion) {
          throw new AuthenticationError("Question not found");
        }
        assignment.questions = [...oldQuestion, newQuestion];
      } else {
        const questions = await Question.find({ id: questionId });

        if (!questions) {
          throw new Error("Question not found");
        }

        assignment.questions = questions;
      }

      await assignment.save();
      console.log("assignment", assignment);
      return assignment;
    },
  },
  Query: {
    getAssignment: async (_, { id }, context) => {
      const assignment = await Assignment.findOne({
        where: { id },
        relations: ["questions"],
      });
      if (!assignment) {
        throw new AuthenticationError("Assignment not found");
      }
      console.log(assignment);
      return assignment;
    },
    assignmentList: async (_, __, context) => {
      const assignments = await Assignment.find({
        relations: ["questions"],
      });
      console.log(assignments);
      return assignments;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};