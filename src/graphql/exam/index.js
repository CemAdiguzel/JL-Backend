import {
  AuthenticationError,
  gql,
  UserInputError,
} from "apollo-server-express";
import { StudentExamProgression } from "../../entities/StudentExamProgression";
import { Exam } from "../../entities/Exam";
import { Question } from "../../entities/Question";
import { Answers } from "../../entities/Answer";

const typeDefs = gql`
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
    studentExamProgressions: [StudentExamProgression]
    questions: [Question]
  }

  type StudentExamProgression {
    id: ID!
    user: User!
    exam: Exam!
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
  type Answers {
    id: ID!
    questionId: ID!
    answer: String!
  }

  extend type Mutation {
    createExam(
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
    ): Exam

    updateExam(
      id: ID!
      title: String
      description: String
      type: String
      date: String
      time: String
      dueDate: String
      dueTime: String
      duration: String
      gradeScale: String
      resubmissionNumber: String
      resubmissionTime: String
      resubmissionDate: String
      status: Boolean
    ): Exam

    deleteExam(id: ID!): Exam

    assignedExamToUsers(examId: ID!, userIds: [ID!]!): Exam
    assignedQuestionToExam(ExamId: ID!, questionId: ID!): Question
  }

  extend type Query {
    getExam(id: ID!): Exam!
    examList: [Exam!]!
  }
`;

const resolvers = {
  Mutation: {
    createExam: async (
      _,
      {
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
      const exam = new Exam();
      exam.title = title;
      exam.description = description;
      exam.type = type;
      exam.date = date;
      exam.time = time;
      exam.dueDate = dueDate;
      exam.dueTime = dueTime;
      exam.duration = duration;
      exam.gradeScale = gradeScale;
      exam.resubmissionNumber = resubmissionNumber;
      exam.resubmissionTime = resubmissionTime;
      exam.resubmissionDate = resubmissionDate;
      exam.status = status;

      await exam.save();

      return exam;
    },
    updateExam: async (
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
      const exam = await Exam.findOne({ id });
      if (!exam) {
        throw new AuthenticationError("Exam not found");
      }
      if (title) {
        exam.title = title;
      }
      if (description) {
        exam.description = description;
      }
      if (type) {
        exam.type = type;
      }
      if (date) {
        exam.date = date;
      }
      if (time) {
        exam.time = time;
      }
      if (dueDate) {
        exam.dueDate = dueDate;
      }
      if (dueTime) {
        exam.dueTime = dueTime;
      }
      if (duration) {
        exam.duration = duration;
      }
      if (gradeScale) {
        exam.gradeScale = gradeScale;
      }
      if (resubmissionNumber) {
        exam.resubmissionNumber = resubmissionNumber;
      }
      if (resubmissionTime) {
        exam.resubmissionTime = resubmissionTime;
      }
      if (resubmissionDate) {
        exam.resubmissionDate = resubmissionDate;
      }
      if (status) {
        exam.status = status;
      }

      await exam.save();
      return exam;
    },
    deleteExam: async (_, { id }, context) => {
      const exam = await Exam.findOne({ id });
      if (!exam) {
        throw new AuthenticationError("Exam not found");
      }
      // if (exam.status === true) {
      //   throw new UserInputError("Exam is already started");
      // }
      await exam.remove();
      return;
    },
    assignedExamToUsers: async (_, { examId, userIds }, context) => {
      const exam = await Exam.findOne({ id: examId });
      if (!exam) {
        throw new AuthenticationError("Exam not found");
      }
      const users = await User.find({ id: userIds });
      if (!users) {
        throw new AuthenticationError("User not found");
      }
      for (const user of users) {
        const studentExamProgression = new StudentExamProgression();
        studentExamProgression.user = user;
        studentExamProgression.exam = exam;
        await studentExamProgression.save();
      }
      return exam;
    },
    assignedQuestionToExam: async (_, { ExamId, questionId }, context) => {
      const exam = await Exam.findOne({
        where: { id: ExamId },
        relations: ["questions"],
      });
      if (!exam) {
        throw new Error("Exam not found");
      }
      const oldQuestion = exam.questions;
      const newQuestion = await Question.findOne({ id: questionId });
      if (oldQuestion) {
        if (!newQuestion) {
          throw new AuthenticationError("Question not found");
        }
        exam.questions = [...oldQuestion, newQuestion];
      } else {
        const questions = await Question.find({ id: questionId });

        if (!questions) {
          throw new Error("Question not found");
        }

        exam.questions = questions;
      }

      await exam.save();
      return newQuestion;
    },
  },
  Query: {
    getExam: async (_, { id }, context) => {
      const exam = await Exam.findOne({
        where: { id },
        relations: [
          "studentExamProgressions",
          "studentExamProgressions.user",
          "questions",
        ],
      });
      if (!exam) {
        throw new AuthenticationError("Exam not found");
      }
      return exam;
    },
    examList: async (_, __, context) => {
      const exams = await Exam.find({
        relations: [
          "studentExamProgressions",
          "studentExamProgressions.user",
          "questions",
        ],
      });
      return exams;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
