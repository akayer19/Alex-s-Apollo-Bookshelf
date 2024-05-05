const { User } = require('../models');
const { createToken, AuthenticationError } = require('../utils/auth');

const customResolvers = {
  Query: {
    fetchCurrentUser: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');

        return userData;
      }

      throw AuthenticationError;
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
        throw AuthenticationError;
      }

      const correctPassword = await existingUser.isCorrectPassword(password);

      if (!correctPassword) {
        throw AuthenticationError;
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

      throw AuthenticationError;
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

      throw AuthenticationError;
    },
  },
};

module.exports = customResolvers;
