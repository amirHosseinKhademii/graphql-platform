const Order = require("../../models/Order");
const authCheck = require("../../util/authCheck");
const Product = require("../../models/Product");
const User = require("../../models/User");
module.exports = {
  Query: {
    getOrders: async (parent, args, context, info) => {
      try {
        const user = authCheck(context);
        const orders = await Order.find({ userName: user.userName });
        return orders;
      } catch (error) {
        console.error(error);
      }
    },
    getOrder: async (parent, args, context, info) => {
      try {
        const { orderId } = args;
        const order = await Order.findById(orderId);
        let products = [];
        order.products.forEach((item) => {
          const product = Product.findById(item);
          products.unshift(product);
        });
        return products;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Mutation: {
    addOrder: async (parent, args, context, info) => {
      try {
        const { products, price } = args;
        const user = authCheck(context);
        const theUser = await User.findById(user.id);
        const newOrder = new Order({
          userName: user.userName,
          createdAt: new Date().toISOString(),
          products: products,
          price,
        });
        theUser.cart = [];
        const res = await newOrder.save();
        await theUser.save();
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    removeCart: async (parent, args, context, info) => {
      try {
        const { orderId, productId } = args;
        const user = authCheck(context);
        const order = await Order.findById(orderId);
        const product = await Product.findById(productId);
        if (order.userName === user.userName) {
          order.products = order.products.filter((it) => it !== productId);
          order.price = order.price - product.price;
          const res = await order.save();
          return res;
        } else {
          throw new Error({
            msg: "این سفارش متعلق به کاربر دیگری است",
          });
        }
      } catch (error) {
        console.error(error);
      }
    },
    deleteOrder: async (parent, args, context, info) => {
      const { orderId } = args;
      const order = await Order.findById(orderId);
      const res = await order.delete();
      return res;
    },
    payCart: async (parent, args, context, info) => {
      const { orderId } = args;
      const order = await Order.findById(orderId);
      order.payed = true;
      order.status = "در حال پردازش";
      const res = await order.save();
      return res;
    },
    sendCart: async (parent, args, context, info) => {
      const { orderId } = args;
      const order = await Order.findById(orderId);
      order.status = "ارسال شد";
      const res = await order.save();
      return res;
    },
  },
};
