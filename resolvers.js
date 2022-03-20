import pc from "@prisma/client";
import { AuthenticationError, ForbiddenError } from "apollo-server-express";
import { PubSub } from "graphql-subscriptions";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const prisma = new pc.PrismaClient();

const pubsub = new PubSub();

const MESSAGE_ADDED = "MESSAGE_ADDED";

const resolvers = {
  Query: {
    users: async (_, args, { userId }) => {
      if (!userId) throw new ForbiddenError("Not Authorized !");
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: {
          id: {
            not: userId,
          },
        },
      });
      return users;
    },

    messagesByUser: async (_, { receiverId }, { userId }) => {
      if (!userId) throw new ForbiddenError("Not Authorized !");
      const messages = await prisma.message.findMany({
        where: {
          OR: [
            { senderId: userId, receiverId },
            { senderId: receiverId, receiverId: userId },
          ],
        },
        orderBy: {
          createdAt: "asc",
        },
      });
      return messages;
    },
  },

  Mutation: {
    signupUser: async (_, { userNew }, ctx) => {
      const user = await prisma.user.findUnique({
        where: { email: userNew.email },
      });
      if (user) throw new AuthenticationError("User already exists.");
      const hashedPass = await bcrypt.hash(userNew.password, 10);
      const newUser = await prisma.user.create({
        data: {
          ...userNew,
          password: hashedPass,
        },
      });
      return newUser;
    },

    signinUser: async (_, { userSignin: { email, password } }, ctx) => {
      const user = await prisma.user.findUnique({
        where: { email: email },
      });
      if (!user) throw new AuthenticationError("User doesn't exist");
      const doMatch = await bcrypt.compare(password, user.password);
      if (!doMatch) throw new AuthenticationError("Invalid credentials");
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      return { token };
    },

    createMessage: async (_, { receiverId, text }, { userId }) => {
      if (!userId) throw new ForbiddenError("Not Authorized !");
      const message = await prisma.message.create({
        data: {
          text,
          receiverId,
          senderId: userId,
        },
      });
      pubsub.publish(MESSAGE_ADDED, {
        messageAdded: message,
      });
      return message;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED),
    },
  },
};

export default resolvers;
