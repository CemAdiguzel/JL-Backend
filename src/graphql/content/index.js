import { AuthenticationError, gql, UserInputError } from 'apollo-server-express';
import { UserContentProgression } from '../../entities/UserContentProgression';
import { Content } from '../../entities/Content';
import { Roadmap } from '../../entities/Roadmap';

const typeDefs = gql`
  enum ContentType {
    BlogPost
    Quiz
  }

  type Content {
    id: ID!
    title: String!
    contentType: ContentType
    description: String
    content: String
    image: String
    question: String
    rightAnswerIdx: Int
    options: [String]
    roadmap: Roadmap
    contentsUserProgression: UserContentProgression
  }

  extend type Mutation {
    createContent(
      roadmapId: ID!
      title: String!
      contentType: ContentType!
      description: String
      blogContent: String
      image: String
      question: String
      rightAnswerIdx: Int
      options: [String]
    ): Content! @adminOnly

    updateContent(
      id: ID!
      title: String
      description: String
      blogContent: String
      image: String
      contentType: ContentType
      question: String
      rightAnswerIdx: Int
      options: [String]
    ): Content! @adminOnly

    deleteContent(id: ID!): Content! @adminOnly
  }

  extend type Query {
    getContent(id: ID!): Content!
  }
`;

const resolvers = {
  Mutation: {
    async createContent(
      _,
      { roadmapId, title, description, blogContent, image, contentType, question, rightAnswerIdx, options },
      context,
    ) {
      const user = context.user;

      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const roadmap = await Roadmap.findOne({ relations: ['contents'], where: { id: roadmapId } });
      if (!roadmap) {
        throw new UserInputError('Roadmap not found');
      }

      const content = new Content();
      content.title = title;
      content.description = description;
      content.content = blogContent;
      content.image = image;
      content.contentType = contentType;
      content.question = question;
      content.rightAnswerIdx = rightAnswerIdx;
      content.options = options;
      content.roadmap = roadmap;
      await content.save();

      roadmap.contents.push(content);
      await roadmap.save();

      return content;
    },
    async updateContent(
      _,
      { id, title, description, blogContent, image, contentType, question, rightAnswerIdx, options },
      { user },
    ) {
      if (!user) {
        throw new AuthenticationError('User not found');
      }

      const content = await Content.findOne({ id });
      if (!content) {
        throw new UserInputError('Content not found');
      }

      if (title) {
        content.title = title;
      }
      if (description) {
        content.description = description;
      }
      if (blogContent) {
        content.content = blogContent;
      }
      if (image) {
        content.image = image;
      }
      if (contentType) {
        content.contentType = contentType;
      }
      if (question) {
        content.question = question;
      }
      if (rightAnswerIdx) {
        content.rightAnswerIdx = rightAnswerIdx;
      }
      if (options) {
        content.options = options;
      }

      await content.save();
      return content;
    },
    async deleteContent(_, { id }) {
      const content = await Content.findOne({ id });
      if (!content) {
        throw new UserInputError('Content not found');
      }

      await content.remove();
      return content;
    },
  },
  Query: {
    async getContent(_, { id }) {
      const content = await Content.findOne({
        where: { id },
        relations: ['userProgressions'],
      });
      if (!content) {
        throw new UserInputError('Content not found');
      }

      return content;
    },
  },
  Content: {
    contentsUserProgression: async (content, _, context) => {
      // only my roadmaps come here
      const user = context.user;
      const myContentProgression = await UserContentProgression.createQueryBuilder('userContentProgression')
        .where('userContentProgression.userId = :userId', { userId: user.id })
        .andWhere('userContentProgression.contentId = :contentId', {
          contentId: content.id,
        })
        .getOne();

      return myContentProgression;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
};
