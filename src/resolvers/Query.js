function feed(root, args, ctx, info) {
   return ctx.prisma.links()
}

function info() {
  return `Another string`
}

function link(root, args, ctx, info)  {
  return ctx.prisma.link({id: args.id})
}

module.exports = {
  feed,
  info,
  link
}