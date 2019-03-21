const { GraphQLServer } = require('graphql-yoga')

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
      links = links.map(link => {
        if(link.id === `link-${args.id}`) {
          return {id: `link-${args.id}`, url: args.url, description: args.description};
        } else {
          return link;
        }
      })
      return links.find(link => link.id === `link-${args.id}`);
    }
  }
}

const server = new GraphQLServer({
  typeDefs: './schema.graphql',
  resolvers
});

server.start(() => console.log('Server is running on port 4000'))