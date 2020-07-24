const user = require("./user");
const product = require("./product");
const order = require("./order");
const post = require("./post");
const message = require("./message");
module.exports = {
  Product: {
    likeCount: (parent, args) => {
      return parent.likes.length;
    },
    commentCount: (parent, args) => {
      return parent.comments.length;
    },
  },
  User: {
    followerCount: (parent, args) => {
      return parent.followers.length;
    },
  },
  Post: {
    likeCount: (parent, args) => {
      return parent.likes.length;
    },
    commentCount: (parent, args) => {
      return parent.comments.length;
    },
  },
  Query: {
    ...user.Query,
    ...product.Query,
    ...order.Query,
    ...post.Query,
    ...message.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...product.Mutation,
    ...order.Mutation,
    ...post.Mutation,
    ...message.Mutation,
  },
  Subscription: {
    ...user.Subscription,
    ...message.Subscription,
  },
};
