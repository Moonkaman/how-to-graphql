const { GraphQLServer } = require('graphql-yoga')
const {prisma} = require('./generated/prisma-client');


async function main() {
  const newLink = await prisma.createLink({
    url: 'www.prisma.io',
    description: 'Prisma replaces traditional ORMs',
  })
  console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`);

  const allLinks = await prisma.links();
  console.log(allLinks)
}

main().catch(e => console.error(e));


let links = [{
  id: 'link-0',
  url: 'www.google.com',
  description: 'Search things on the world wide web'
}]

let idCount = links.length;

const resolvers = {
  Query: {
    info: () => `Another string`,
    feed: () => links,
    link: (parent, args) => links.find(link => link.id === `link-${args.id}`)
  },
  Mutation: {
    post: (parent, args) => {
      const link = {
        id: `link-${idCount++}`,
        description: args.description,
        url: args.url
      }
      links.push(link);
      return link;
    },
    deleteLink: (parent, args) => {
      links = links.filter(link => link.id !== `link-${args.id}`);
      return 'Deleted!';
    },
    updateLink: (parent, args) => {
      const link = links.find(link => link.id === `link-${args.id}`);
      link.url = args.url ? args.url : link.url;
      link.description = args.description ? args.description : link.description;
      return link;
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers
});

server.start(() => console.log('Server is running on port 4000'))