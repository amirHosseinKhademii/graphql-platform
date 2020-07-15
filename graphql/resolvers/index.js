const user = require("./user");
const product = require("./product");
const order = require("./order");
module.exports = {
  Product: {
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
  },
  Mutation: {
    ...user.Mutation,
    ...product.Mutation,
    ...order.Mutation,
  },
  Subscription: {
    ...user.Subscription,
  },
};
