import { AuthenticationError, gql, UserInputError } from 'apollo-server-express';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import process from 'process';
import { User } from '../../entities/User';

const SECRET = process.env.SECRET_KEY || 'SECRET';

// noinspection Annotator
const typeDefs = gql`
  extend type Mutation {
    register(
      email: String!
      password: String!
      firstName: String!
      lastName: String!
      userRole: UserRole
    ): LoginResponse

    authenticate(email: String!, password: String!): LoginResponse
    editProfile(firstName: String, lastName: String, profilePhoto: String): User @isAuthenticated
  }

  type PaginatedUsers {
    users: [User]
    total: Int
  }

  extend type Query {
    userList(pagination: PaginationInput): PaginatedUsers @adminOnly
    getUser(id: ID!): User @isAuthenticated
  }

  enum UserRole {
    User
    SuperUser
    CompanyManager
  }

  type User {
    id: String!
    about: String
    email: String
    firstName: String
    lastName: String
    fullName: String
    profilePhoto: String
    userRole: UserRole
    company: Company
    roadmapProgressions: [UserRoadmapProgression]
    contentProgressions: [UserContentProgression]
  }

  type Company {
    id: String!
    name: String
    logo: String
    description: String
    roadmaps: [Roadmap]
    users: [User]
  }

  type LoginResponse {
    token: String!
    user: User!
  }
`;

const resolvers = {
  Mutation: {
    register: async (_, { email, password, firstName, lastName, userRole }, context) => {
      email = email.toLowerCase();
      if (await User.findOne({ email })) {
        throw new UserInputError(`User with email (${email}) already exists.`, {
          invalidArgs: ['email'],
        });
      }

      const hashedPassword = await argon2.hash(password);
      const newUser = new User();
      newUser.email = email;
      newUser.password = hashedPassword;
      newUser.firstName = firstName;
      newUser.lastName = lastName;

      if (userRole) {
        newUser.userRole = userRole;
      }

      await newUser.save();

      const token = jwt.sign({ id: newUser.id }, SECRET, { expiresIn: '1y' });

      context.user = newUser;

      return {
        token: token,
        user: newUser,
      };
    },
    authenticate: async (_, { email, password }, context) => {
      const user = await User.findOne({ where: { email }, relations: ['company'] });

      if (!user) {
        throw new AuthenticationError('No such user.');
      }

      const passwordCheck = await argon2.verify(user.password, password);

      if (!passwordCheck) {
        throw new AuthenticationError('Wrong password.');
      }

      const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: '1y' });

      //mutate context
      context.user = user;
      return {
        token: token,
        user: user,
      };
    },
    editProfile: async (_, { firstName, lastName, profilePhoto }, context) => {
      let user = context.user;

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      if (firstName) {
        user.firstName = firstName;
      }
      if (lastName) {
        user.lastName = lastName;
      }
      if (profilePhoto) {
        user.profilePhoto = profilePhoto;
      }
      await user.save();
      return user;
    },
  },
  Query: {
    userList: async (_, { pagination }, context) => {
      const page = pagination?.limit || 0;
      const limit = pagination?.limit || 100;

      const admin = context.user;
      const paginatedRes = await User.findAndCount({
        relations: [
          'contentProgressions',
          'contentProgressions.content',
          'contentProgressions.content.roadmap',
          'roadmapProgressions',
          'roadmapProgressions.roadmap',
          'company',
        ],
        where: { company: { id: admin.company.id }, userRole: 'User' },
        take: limit,
        skip: limit * page,
      });

      return {
        users: paginatedRes[0],
        total: paginatedRes[1],
      };
    },
    getUser: async (_, { id }, context) => {
      const user = await User.findOne({ where: { id }, relations: ['company'] });
      if (!user) {
        throw new AuthenticationError('User not found');
      }
      return user;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
