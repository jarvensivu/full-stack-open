const { ApolloServer } = require("@apollo/server");
const { startStandaloneServer } = require("@apollo/server/standalone");
const { GraphQLError } = require("graphql");
const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const Book = require("./models/book");
const Author = require("./models/author");

require("dotenv").config();

const MONGODB_URI = process.env.MONGODB_URI;

console.log("connecting to", MONGODB_URI);

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log("connected to MongoDB");
  })
  .catch((error) => {
    console.log("error connection to MongoDB:", error.message);
  });

const typeDefs = `
  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book]!
    allAuthors: [Author]!
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String]!
    ): Book
    editAuthor(
      name: String!,
      setBornTo: Int!
    ): Author
  }
`;

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author && args.genre) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({
          $and: [{ author: author.id }, { genres: { $in: [args.genre] } }],
        }).populate("author");
      } else if (args.author) {
        const author = await Author.findOne({ name: args.author });
        return Book.find({ author: author.id }).populate("author");
      } else if (args.genre) {
        return Book.find({ genres: { $in: [args.genre] } }).populate("author");
      }
      return Book.find({}).populate("author");
    },
    allAuthors: async () => Author.find({}),
  },
  Author: {
    bookCount: async (root) => Book.find({ author: root.id }).countDocuments(),
  },
  Mutation: {
    addBook: async (root, args) => {
      try {
        let author = await Author.findOne({ name: args.author });

        if (!author) author = new Author({ name: args.author });
        await author.save();

        const book = new Book({ ...args, author });
        await book.save();

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
    editAuthor: async (root, args) => {
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
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
}).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
