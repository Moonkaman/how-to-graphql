const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {APP_SECRET, getUserId} = require('../utils');

function post(root, args, ctx) {
  const userId = getUserId(context);
  return ctx.prisma.createLink({
    url: args.url,
    description: args.description,
    postedBy: {connect: {id: userId}}
  })
}

function deleteLink(root, args, ctx, info) {
  return ctx.prisma.deleteLink({id: args.id});
}

function updateLink(root, args, ctx, info) {
  return ctx.prisma.updateLink({where: {id: args.id}, data: {url: args.url, description: args.description}});
}

async function signup(root, args, ctx, info) {
  const password = await bcrypt.hash(args.password, 10);
  const user = await ctx.prisma.createUser({...args, password});
  const token = jwt.sign({userId: user.id}, APP_SECRET)
  return {
    token,
    user
  }
}

async function login(root, args, ctx, info) {
  const user = await ctx.prisma.user({email: args.email});
  if (!user) {
    throw new Error('No such user found')
  }

  const valid = await bcrypt.compare(args.password, user.password)
  if (!valid) {
    throw new Error('Invalid credentials')
  }

  const token = jwt.sign({userId: user.id}, APP_SECRET)

  return {
    token,
    user
  }
}

module.exports = {
  post,
  deleteLink,
  updateLink,
  signup,
  login
}