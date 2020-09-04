const authCheck = require("../../util/authCheck");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

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
          if (product) {
            products.unshift(product);
          } else {
            return;
          }
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
        const newOrder = new Order({
          userName: user.userName,
          createdAt: new Date().toISOString(),
          products: products,
          price,
        });
        await newOrder.save();
        return true;
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
          await order.save();
          return true;
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
      await order.delete();
      return true;
    },
    payCart: async (parent, args, context, info) => {
      const { orderId } = args;
      const order = await Order.findById(orderId);
      order.payed = true;
      order.status = "در حال پردازش";
      await order.save();
      return true;
    },
    sendCart: async (parent, args, context, info) => {
      const { orderId } = args;
      const order = await Order.findById(orderId);
      order.status = "ارسال شد";
      await order.save();
      return true;
    },
  },
};
