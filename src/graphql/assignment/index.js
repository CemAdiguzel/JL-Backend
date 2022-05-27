import {
  AuthenticationError,
  gql,
  UserInputError,
} from "apollo-server-express";
import { Assignment } from "../../entities/Assignment";
import { Question } from "../../entities/Question";
import { User } from "../../entities/User";
import { StudentAssignmentProgression } from "../../entities/StudentAssignmentProgression";

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
    isEnded: Boolean!
    studentAssignmentProgressions: [StudentAssignmentProgression]
    questions: [Question]
  }

  type StudentAssignmentProgression {
    id: ID!
    user: User!
    assignment: Assignment!
  }

  type Question {
    id: ID!
    questionDesc: String
    answer: String
    grade: String
    gradingInput: String
    gradingOutput: String
    autoGrade: Boolean
    answers: [Answers]
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
      isEnded: Boolean!
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
      isEnded: Boolean
    ): Assignment

    deleteAssignment(id: ID!): Assignment

    assignedAssignmentToUser(assignmentId: ID!, userId: ID!): Assignment
    assignedQuestionToAssignment(AssignmentId: ID!, questionId: ID!): Question
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
        isEnded,
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
      assignment.isEnded = isEnded;

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
        isEnded,
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
      if (isEnded) {
        assignment.isEnded = isEnded;
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
      return;
    },
    assignedAssignmentToUser: async (_, { assignmentId, userId }, context) => {
      const assignment = await Assignment.findOne({ id: assignmentId });
      if (!assignment) {
        throw new AuthenticationError("Assignment not found");
      }
      const user = await User.findOne({ id: userId });
      if (!user) {
        throw new AuthenticationError("User not found");
      }
      if (user.userRole === "Lecturer") {
        throw new AuthenticationError("User is lecturer");
      }
      const studentAssignmentProgression = new StudentAssignmentProgression();
      studentAssignmentProgression.user = user;
      studentAssignmentProgression.assignment = assignment;
      await studentAssignmentProgression.save();

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
      const newQuestion = await Question.findOne({ id: questionId });
      if (oldQuestion) {
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
      return newQuestion;
    },
  },
  Query: {
    getAssignment: async (_, { id }, context) => {
      const assignment = await Assignment.findOne({
        where: { id },
        relations: [
          "questions",
          "questions.answers",
          "studentAssignmentProgressions",
          "studentAssignmentProgressions.user",
        ],
      });
      if (!assignment) {
        throw new AuthenticationError("Assignment not found");
      }
      return assignment;
    },
    assignmentList: async (_, __, context) => {
      const assignments = await Assignment.find({
        relations: [
          "questions",
          "studentAssignmentProgressions",
          "studentAssignmentProgressions.user",
        ],
      });
      return assignments;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
