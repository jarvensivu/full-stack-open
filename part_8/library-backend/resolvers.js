const { GraphQLError } = require("graphql");
const jwt = require('jsonwebtoken')
const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require("./models/book");
const Author = require("./models/author");
const User = require("./models/user");

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      const author = await Author.findOne({ name: args.author });
      if (args.author && args.genre) {
        return Book.find({ $and: [{ author: author.id }, { genres: { $in: [args.genre] } }]}).populate("author");
      } else if (args.author) {
        return Book.find({ author: author.id }).populate("author");
      } else if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }
      return Book.find({}).populate("author");
    },
    allGenres: async () => {
      const books = await Book.find({});
      const genres = new Set();
      books.forEach((book) => {
        book.genres.forEach((genre) => genres.add(genre));
      });
      return Array.from(genres).sort();
    },
    allAuthors: async () => Author.find({}),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => Book.find({ author: root.id }).countDocuments(),
  },
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) author = new Author({ name: args.author });
        await author.save();

        const book = new Book({ ...args, author });
        await book.save();

        pubsub.publish("BOOK_ADDED", { bookAdded: book });

        return book;
      } catch (error) {
        let errorMessage = "Saving book failed";

        if (error instanceof mongoose.Error.ValidationError) {
          console.log(error.message);

          if (error.errors.hasOwnProperty("name")) {
            errorMessage = "Saving book failed. Author name is not valid";
          } else if (error.errors.hasOwnProperty("title")) {
            errorMessage = "Saving book failed. Book title is not valid";
          }
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          console.log(error);
          throw new GraphQLError(errorMessage);
        }
      }
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser

      if (!currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const author = await Author.findOne({ name: args.name });

      if (author) {
        author.born = args.setBornTo;

        try {
          return await author.save();
        } catch (error) {
          console.log(error);
          throw new GraphQLError("Editing author failed");
        }
      }

      return null;
    },
    createUser: async (root, args) => {
      const user = new User({ ...args });

      try {
        return await user.save();
      } catch (error) {
        let errorMessage = "Creating user failed";

        if (error instanceof mongoose.Error.ValidationError) {
          console.log(error.message);

          if (error.errors.hasOwnProperty("usename")) {
            errorMessage = "Creating user failed. User name is not valid";
          } else if (error.errors.hasOwnProperty("favoriteGenre")) {
            errorMessage =
              "Creating user failed. User favorite genre is not valid";
          }
          throw new GraphQLError(errorMessage, {
            extensions: {
              code: "BAD_USER_INPUT",
            },
          });
        } else {
          console.log(error);
          throw new GraphQLError(errorMessage);
        }
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if ( !user || args.password !== 'secret' ) {
        throw new GraphQLError('Wrong credentials', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }
      return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
    },
  },
};

module.exports = resolvers;
