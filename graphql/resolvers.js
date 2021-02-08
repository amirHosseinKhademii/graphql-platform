const user = require("./User/resolvers");
const product = require("./Product/resolvers");
const order = require("./Order/resolvers");
const post = require("./Post/resolvers");
const message = require("./Message/resolvers");
const shop = require("./Shop/resolvers");
const style = require("./Style/resolvers");

module.exports = {
  Product: {
    likeCount: (parent, args) => {
      return parent.likes.length;
    },
    commentCount: (parent, args) => {
      return parent.comments.length;
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
  Shop: {
    followerCount: (parent, args) => {
      return parent.followers.length;
    },
    productCount: (parent, args) => {
      return parent.products.length;
    },
  },
  Query: {
    ...user.Query,
    ...product.Query,
    ...order.Query,
    ...post.Query,
    ...message.Query,
    ...shop.Query,
    ...style.Query,
  },
  Mutation: {
    ...user.Mutation,
    ...product.Mutation,
    ...order.Mutation,
    ...post.Mutation,
    ...message.Mutation,
    ...shop.Mutation,
    ...style.Mutation,
  },
  Subscription: {
    ...user.Subscription,
    ...message.Subscription,
    ...product.Subscription,
    ...shop.Subscription,
  },
};
