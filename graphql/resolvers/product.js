const Product = require("../../models/Product");
const authCheck = require("../../util/authCheck");
module.exports = {
  Query: {
    getProducts: async (parent, args, context, info) => {
      const products = await Product.find().sort({ createdAt: -1 });
      return products;
    },
    getProduct: async (parent, args, context, info) => {
      const product = await Product.findById(args.productId);
      return product;
    },
  },
  Mutation: {
    createProduct: async (parent, args, context, info) => {
      const { userName } = authCheck(context);
      const { image, price, color, company, size, number, desc, title } = args;
      const newProduct = new Product({
        image,
        price,
        color,
        company,
        size,
        number,
        desc,
        title,
        userName,
        createdAt: new Date().toISOString(),
      });
      const res = await newProduct.save();
      return res;
    },
    deleteProduct: async (parent, args, context, info) => {
      const user = authCheck(context);
      const product = await Product.findById(args.productId);
      if (product.userName === user.userName) {
        const res = await product.delete();
        return res;
      }
    },
    updateProduct: async (parent, args, context, info) => {
      const {
        image,
        price,
        color,
        company,
        size,
        number,
        productId,
        desc,
        title,
      } = args;
      const product = await Product.findById(productId);
      product.image = image ? image : product.image;
      product.price = price ? price : product.price;
      product.color = color ? color : product.color;
      product.company = company ? company : product.company;
      product.size = size ? size : product.size;
      product.number = number ? number : product.number;
      product.desc = desc ? desc : product.desc;
      product.title = title ? title : product.title;
      const res = await product.save();
      return res;
    },
    likeProduct: async (parent, args, context, info) => {
      try {
        const { productId } = args;
        const product = await Product.findById(productId);
        const user = authCheck(context);
        const find = product.likes.find(
          (ite) => ite.userName === user.userName
        );
        if (find) {
          product.likes = product.likes.filter(
            (is) => is.userName !== user.userName
          );
        } else {
          product.likes = [
            ...product.likes,
            {
              userName: user.userName,
              createdAt: new Date().toISOString(),
            },
          ];
        }
        const res = await product.save();
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    createComment: async (parent, args, context, info) => {
      const { productId, body } = args;
      try {
        const product = await Product.findById(productId);
        const user = authCheck(context);
        product.comments = [
          {
            body,
            userName: user.userName,
            createdAt: new Date().toISOString(),
          },
          ...product.comments,
        ];
        const res = await product.save();
        return res;
      } catch (error) {
        console.error(error);
      }
    },
    deleteComment: async (parent, args, context, info) => {
      try {
        const { productId, commentId } = args;
        const user = authCheck(context);
        const product = await Product.findById(productId);
        const comment = product.comments.find((it) => it.id === commentId);
        if (comment && comment.userName === user.userName) {
          product.comments = product.comments.filter(
            (item) => item.id !== commentId
          );
          const res = await product.save();
          return res;
        } else {
          throw new Error({ msg: "این نظر متعلق به فرد دیگری است" });
        }
      } catch (error) {
        console.error(error);
      }
    },
  },
};
