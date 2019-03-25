const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client');

const Query = require('./resolvers/Query');
const Mutation = require('./resolvers/Mutation');
const User = require('./resolvers/User');
const Link = require('./resolvers/Link');


// async function main() {
  // const newLink = await prisma.createLink({
  //   url: 'www.prisma.io',
  //   description: 'Prisma replaces traditional ORMs',
  // })
  // console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`);

//   const allLinks = await prisma.links();
//   console.log(allLinks)
// }

// main().catch(e => console.error(e));

const resolvers = {
  Query,
  Mutation,
  User,
  Link
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: request => {
    return {
      ...request,
      prisma
    }
  }
});

server.start(() => console.log('Server is running on port 4000'))