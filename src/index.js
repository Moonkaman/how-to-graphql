const { GraphQLServer } = require('graphql-yoga')
const { prisma } = require('./generated/prisma-client');


async function main() {
  // const newLink = await prisma.createLink({
  //   url: 'www.prisma.io',
  //   description: 'Prisma replaces traditional ORMs',
  // })
  // console.log(`Created new link: ${newLink.url} (ID: ${newLink.id})`);

  const allLinks = await prisma.links();
  console.log(allLinks)
}

main().catch(e => console.error(e));

const resolvers = {
  Query: {
    info: () => `Another string`,
    feed: (root, args, ctx, info) => ctx.prisma.links(),
    link: (root, args, ctx, info) => ctx.prisma.link({id: args.id})
  },
  Mutation: {
    post: (root, args, ctx) => {
      return ctx.prisma.createLink({
        url: args.url,
        description: args.description
      })
    },
    deleteLink: (root, args, ctx, info) => {
      return ctx.prisma.deleteLink({id: args.id});
    },
    updateLink: (root, args, ctx, info) => {
      return ctx.prisma.updateLink({where: {id: args.id}, data: {url: args.url, description: args.description}});
    }
  }
}

// const resolvers = {
//   Query: {
//     info: () => `Another string`,
//     feed: () => links,
//     link: (parent, args) => links.find(link => link.id === `link-${args.id}`)
//   },
//   Mutation: {
//     post: (parent, args) => {
//       const link = {
//         id: `link-${idCount++}`,
//         description: args.description,
//         url: args.url
//       }
//       links.push(link);
//       return link;
//     },
//     deleteLink: (parent, args) => {
//       links = links.filter(link => link.id !== `link-${args.id}`);
//       return 'Deleted!';
//     },
//     updateLink: (parent, args) => {
//       const link = links.find(link => link.id === `link-${args.id}`);
//       link.url = args.url ? args.url : link.url;
//       link.description = args.description ? args.description : link.description;
//       return link;
//     }
//   }
// }

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: { prisma }
});

server.start(() => console.log('Server is running on port 4000'))