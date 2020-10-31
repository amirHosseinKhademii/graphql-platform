const { UserInputError } = require("apollo-server");
const Shop = require("../../models/Shop");
const User = require("../../models/User");
const authCheck = require("../../util/authCheck");

// other shits
module.exports = {
  Query: {
    getShops: async () => {
      try {
        const shops = await Shop.find().populate("owner");
        return shops;
      } catch (error) {
        console.error(error);
      }
    },
    getShop: async (parent, { id }) => {
      try {
        const shop = await Shop.findById(id).populate("owner");
        return shop;
      } catch (error) {
        console.error(error);
      }
    },
    getFollowers: async (parent, { id }) => {
      const user = await Shop.findById(id);
      let followers = [];
      user.followers.forEach((item) => {
        const following = User.findById(item);
        followers.push(following);
      });
      return followers;
    },
  },
  Mutation: {
    createShop: async (parent, args, context) => {
      const { type, name, country, region, city, createdAt, images } = args;
      const shop = await Shop.findOne({ name: name });
      const user = authCheck(context);
      //validation
      if (shop) {
        throw new UserInputError("فروشگاه تکراری", {
          errors: {
            msg: "این فروشگاه  قبلا ثبت شده است",
          },
        });
      } else {
        const newShop = new Shop({
          type,
          name,
          owner: user.id,
          country,
          region,
          city,
          createdAt,
          images,
          createdAt: new Date().toDateString(),
        });
        const res = await newShop.save();
        context.pubsub.publish("NEW_SHOP", {
          shop: res,
        });
        const owner = await User.findById(user.id);
        owner.shops.push(newShop);
        await owner.save();
        return true;
      }
    },
    addFollower: async (parent, { id }, context) => {
      const user = authCheck(context);
      const targetShop = await Shop.findById(id);
      const find = targetShop.followers.find((it) => it === user.id);
      if (find) {
        targetShop.followers = targetShop.followers.filter(
          (ite) => ite !== user.id
        );
      } else {
        targetShop.followers = [...targetShop.followers, user.id];
      }
      await targetShop.save();
      context.pubsub.publish("NEW_FOLLOWER", {
        user: id,
      });
      return true;
    },
  },
  Subscription: {
    onShopCreate: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator("NEW_SHOP");
      },
    },
    onFollow: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator("NEW_FOLLOWER");
      },
    },
  },
};
