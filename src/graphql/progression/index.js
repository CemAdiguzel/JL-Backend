import { AuthenticationError, gql, UserInputError } from 'apollo-server-express';
import { Content } from '../../entities/Content';
import { Progression, UserRole } from '../../entities/enums';
import { Roadmap } from '../../entities/Roadmap';
import { User } from '../../entities/User';
import { UserContentProgression } from '../../entities/UserContentProgression';
import { UserRoadmapProgression } from '../../entities/UserRoadmapProgression';

const typeDefs = gql`
  extend type Query {
    adminContentProgressionList: [UserContentProgression!]! @adminOnly
    adminRoadmapProgressionList: [UserRoadmapProgression!]! @adminOnly
  }

  extend type Mutation {
    progressContent(contentId: ID!, userId: ID): UserContentProgression! @isAuthenticated
    progressRoadmap(roadmapId: ID!, userId: ID): UserRoadmapProgression! @isAuthenticated
  }

  type UserContentProgression {
    id: ID
    content: Content
    value: Int
    progression: Progression
    createdAt: String
    updatedAt: String
    user: User
    roadmap: Roadmap
  }

  type UserRoadmapProgression {
    id: ID
    roadmap: Roadmap
    value: Int
    progression: Progression
    createdAt: String
    updatedAt: String
    user: User
  }

  enum Progression {
    InProgress
    Completed
  }
`;

const resolvers = {
  Mutation: {
    async progressContent(_, { contentId, userId }, context) {
      let user = context.user;

      if (user.userRole !== UserRole.User) {
        user = await User.findOne({ id: userId });
        if (!user) {
          throw new AuthenticationError(`User with id: ${userId} not found`);
        }
      }

      const content = await Content.findOne({ id: contentId });
      if (!content) {
        throw new UserInputError('Content not found');
      }
      let progression = await UserContentProgression.findOne({
        relations: ['content'],
        where: {
          user,
          content,
        },
      });

      if (!progression) {
        // Create a new progression for the user
        progression = UserContentProgression.create({
          user,
          content,
        });
        progression.progression = Progression.InProgress;
        await progression.save();
      } else {
        // Completed
        progression.progression = Progression.Completed;
        progression.value = 100;
        await progression.save();
      }

      return progression;
    },
    async progressRoadmap(_, { roadmapId, userId }, context) {
      let user = context.user;

      if (user.userRole !== UserRole.User) {
        user = await User.findOne({ id: userId });
        if (!user) {
          throw new AuthenticationError(`User with id: ${userId} not found`);
        }
      }

      const roadmap = await Roadmap.findOne({ where: { id: roadmapId }, relations: ['contents'] });
      if (!roadmap) {
        throw new UserInputError('Roadmap not found');
      }
      let progression = await UserRoadmapProgression.findOne({
        relations: ['roadmap'],
        where: {
          user,
          roadmap,
        },
      });

      if (!progression) {
        // Create a new progression for the user
        progression = UserRoadmapProgression.create({
          user,
          roadmap,
        });
        progression.progression = Progression.InProgress;
        await progression.save();
        // for each content in the roadmap, create a new progression
        for (const content of roadmap.contents) {
          const userContentProgression = UserContentProgression.create({
            user,
            content,
          });
          userContentProgression.progression = Progression.InProgress;
          await userContentProgression.save();
        }
      } else {
        // Completed
        progression.progression = Progression.Completed;
        progression.value = 100;
        await progression.save();
      }

      return roadmap;
    },
  },
  Query: {
    async adminContentProgressionList() {
      return await UserContentProgression.find({
        relations: ['content'],
      });
    },
    async adminRoadmapProgressionList() {
      return await UserRoadmapProgression.find({
        relations: ['roadmap'],
      });
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
