import { AuthenticationError, gql, UserInputError } from 'apollo-server-express';
import { UserRoadmapProgression } from '../../entities/UserRoadmapProgression';
import { Roadmap } from '../../entities/Roadmap';
import { User } from '../../entities/User';
import { Content } from '../../entities/Content';
import { UserContentProgression } from '../../entities/UserContentProgression';
import { ContentType, Progression } from '../../entities/enums';

const typeDefs = gql`
  type Roadmap {
    id: ID!
    image: String
    title: String!
    description: String
    contents: [Content]
    roadmapsContentProgressions: [UserContentProgression]
  }

  extend type Mutation {
    createRoadmap(title: String!, description: String, image: String, contents: String): Roadmap! @adminOnly
    updateRoadmap(id: ID!, title: String, description: String, image: String, contents: String): Roadmap! @adminOnly
    deleteRoadmap(id: ID!): Boolean @adminOnly
  }

  input PaginationInput {
    page: Int
    limit: Int
  }

  type PaginatedRoadmaps {
    roadmaps: [Roadmap]
    total: Int
  }

  extend type Query {
    allRoadmaps(pagination: PaginationInput): PaginatedRoadmaps!
    myRoadmaps(pagination: PaginationInput): PaginatedRoadmaps!
    getRoadmap(id: ID!): Roadmap!
  }
`;

const resolvers = {
  Mutation: {
    async createRoadmap(_, { title, description, image, contents }, context) {
      const user = context.user;

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      let roadmap = new Roadmap();
      roadmap.title = title;
      roadmap.description = description;
      roadmap.image = image;
      roadmap.company = user.company;
      roadmap = await roadmap.save();
      roadmap.contents = [];

      const journeyContents = JSON.parse(contents);

      for (const content of journeyContents) {
        let newContent = new Content();
        newContent.title = content.title;
        newContent.description = content.description;
        newContent.content = content.content;
        newContent.contentType = ContentType[content.contentType];
        newContent.question = content.question;
        newContent.rightAnswerIdx = content.rightAnswerIdx;
        newContent.options = content.options;
        newContent.roadmap = roadmap;
        newContent = await newContent.save();
        // update roadmap contents
        roadmap.contents.push(newContent);
        await roadmap.save();
      }

      return roadmap;
    },
    async updateRoadmap(_, { id, title, description, image, contents }, context) {
      const user = context.user;

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const roadmap = await Roadmap.findOne({ id }, { relations: ['contents'] });
      if (!roadmap) {
        throw new UserInputError('Roadmap not found');
      }
      if (title) {
        roadmap.title = title;
      }
      if (description) {
        roadmap.description = description;
      }
      if (image) {
        roadmap.image = image;
      }
      if (contents) {
        const journeyContents = JSON.parse(contents);
        for (const content of journeyContents) {
          if (!content.id) {
            let newContent = new Content();
            newContent.title = content.title;
            newContent.description = content.description;
            newContent.content = content.content;
            newContent.contentType = ContentType[content.contentType];
            newContent.question = content.question;
            newContent.rightAnswerIdx = content.rightAnswerIdx;
            newContent.options = content.options;
            newContent.roadmap = roadmap;
            newContent = await newContent.save();
            // update roadmap contents
            roadmap.contents.push(newContent);
          }
        }
      }

      await roadmap.save();
      return roadmap;
    },
    async deleteRoadmap(_, { id }) {
      const roadmap = await Roadmap.findOne({ id }, { relations: ['contents'] });
      if (!roadmap) {
        throw new UserInputError('Roadmap not found');
      }

      for (const content of roadmap.contents) {
        await Content.delete(content.id);
      }

      await roadmap.remove();
      return true;
    },
  },
  Query: {
    async allRoadmaps(_, { pagination }) {
      const page = pagination?.limit || 0;
      const limit = pagination?.limit || 100;

      const roadmaps = await Roadmap.findAndCount({
        relations: ['userProgressions', 'userProgressions.user', 'contents'],
        take: limit,
        skip: page * limit,
      });

      return {
        roadmaps: roadmaps[0],
        total: roadmaps[1],
      };
    },
    async myRoadmaps(_, { pagination }, context) {
      const page = pagination?.limit || 0;
      const limit = pagination?.limit || 100;
      const user = context.user;

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const roadmaps = await Roadmap.createQueryBuilder('roadmap')
        .leftJoinAndSelect('roadmap.userProgressions', 'userProgressions')
        .where('userProgressions.userId = :userId', { userId: user.id })
        .take(limit)
        .skip(page * limit)
        .getManyAndCount();

      return {
        roadmaps: roadmaps[0],
        total: roadmaps[1],
      };
    },
    async getRoadmap(_, { id }) {
      return await Roadmap.createQueryBuilder('roadmap')
        .leftJoinAndSelect('roadmap.userProgressions', 'userProgressions')
        .leftJoinAndSelect('roadmap.contents', 'contents')
        .where('roadmap.id = :id', { id })
        .orderBy('contents.createdAt', 'DESC')
        .getOne();
    },
  },
  Roadmap: {
    roadmapsContentProgressions: async (roadmap, _, context) => {
      // only my roadmaps come here
      const user = context.user;
      const myContentProgressions = await UserContentProgression.createQueryBuilder('userContentProgression')
        .leftJoinAndSelect('userContentProgression.content', 'content')
        .where('userContentProgression.userId = :userId', { userId: user.id })
        .andWhere('content.roadmapId = :roadmapId', {
          roadmapId: roadmap.id,
        })
        .orderBy('content.createdAt', 'DESC')
        .getMany();

      return myContentProgressions;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
