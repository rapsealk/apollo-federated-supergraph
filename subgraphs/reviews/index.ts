import fs from "fs";
import path from "path";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import gql from "graphql-tag";
import { buildSubgraphSchema } from "@apollo/subgraph";

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql(fs.readFileSync(path.join(process.cwd(), "reviews.graphql"), { encoding: "utf-8" }));

type Location = {
  id: string;
  overallRating?: number;
  reviewsForLocation: Review[];
};

type Review = {
  id: string;
  comment?: string;
  rating?: number;
  location?: Location;
};

const reviews: Review[] = [
  {
    id: "0001",
    comment: "Lorem ipsum",
    rating: 5,
    location: {
      id: "L0001",
      overallRating: 3.4,
      reviewsForLocation: [],
    },
  },
];

// Resolvers define how to fetch the types defined in your schema.
// This resolver retrieves books from the "books" array above.
const resolvers = {
  Query: {
    // reviews: () => reviews,
    latestReviews: () => {
      console.log(`Query.resolvers.latestReviews()`);
      return reviews;
    },
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  schema: buildSubgraphSchema({ typeDefs, resolvers }),
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
  listen: { port: 4002 },
});

console.log(`🚀  Server ready at: ${url}`);
