import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    books: [Book]
  }
`;

type Book = {
  title: string;
  author: string;
};

const books: Book[] = [
  {
    title: "The Awakening",
    author: "Kate Chopin",
  },
  {
    title: "City of Glass",
    author: "Paul Auster",
  },
];

const locations = `#graphql
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key"])

  type Query {
    "The full list of locations presented by the Interplanetary Space Tourism department"
    locations: [Location!]
    "The details of a specific location"
    location(id: ID!): Location
  }

  type Location @key(fields: "id") {
    id: ID!
    "The name of the location"
    name: String!
    "A short description about the location"
    description: String!
    "The location's main photo as a URL"
    photo: String!
  }
`;

const reviews = `#graphql
  extend schema
    @link(url: "https://specs.apollo.dev/federation/v2.0",
          import: ["@key"])

  type Query {
    "The three latest reviews submitted for FlyBy's locations"
    latestReviews: [Review!]!
  }

  type Mutation {
    submitReview(locationReview: LocationReviewInput): SubmitReviewResponse
  }

  type Location @key(fields: "id") {
    id: ID!
    "The calculated overall rating based on all reviews"
    overallRating: Float
    "All submitted reviews about this location"
    reviewsForLocation: [Review]!
  }

  type Review {
    id: ID!
    "Written text"
    comment: String
    "A number from 1 - 5 with 1 being lowest and 5 being highest"
    rating: Int
    "The location the review is about"
    location: Location
  }

  input LocationReviewInput {
    "Written test"
    comment: String!
    "A number from 1 - 5 with 1 being lowest and 5 being highest"
    rating: Int!
    "Location Id"
    locationId: String!
  }

  type SubmitReviewResponse {
    "Similar to HTTP status code, represents the status of the mutation"
    code: Int!
    "Indicates whether the mutation was successful"
    success: Boolean!
    "Human-readable message for the UI"
    message: String!
    "Newly created review"
    locationReview: Review
  }
`;

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    books: () => books,
    locations: () => locations,
    reviews: () => reviews,
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
