// resolvers.js is where we define the functions that actually execute the queries and mutations we define in typeDefs.js.
const { User } = require('../models');
const { createToken, AuthenticationError } = require('../utils/auth');

const customResolvers = {
  Query: {
    fetchCurrentUser: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
        return userData;
      }
      throw new AuthenticationError('You are not authenticated');
    },
  },
  Mutation: {
    addUserMutation: async (parent, args) => {
      const newUser = await User.create(args);
      const token = createToken(newUser);
      return { token, user: newUser };
    },
    userLogin: async (parent, { email, password }) => {
      const existingUser = await User.findOne({ email });
      if (!existingUser) {
        throw new AuthenticationError('Invalid credentials');
      }
      const correctPassword = await existingUser.isCorrectPassword(password);
      if (!correctPassword) {
        throw new AuthenticationError('Invalid credentials');
      }
      const token = createToken(existingUser);
      return { token, user: existingUser };
    },
    saveUserBook: async (parent, { bookData }, context) => {
      if (context.user) {
        const updatedUser = await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { savedBooks: bookData } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to perform this action');
    },
    removeUserBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId } } },
          { new: true }
        );
        return updatedUser;
      }
      throw new AuthenticationError('You need to be logged in to perform this action');
    },
  },
};

module.exports = customResolvers;
