const { UserInputError } = require("apollo-server");
const Shop = require("../../models/Shop");
const User = require("../../models/User");
const authCheck = require("../../util/authCheck");

// other shits
module.exports = {
  Query: {
    getShops: async () => {
      try {
        const shops = await Shop.find().populate("owner").populate("followers");
        return shops;
      } catch (error) {
        console.error(error);
      }
    },
    getShop: async (parent, { id }) => {
      try {
        const shop = await Shop.findById(id)
          .populate("owner")
          .populate("followers");
        return shop;
      } catch (error) {
        console.error(error);
      }
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
    addShopFollower: async (parent, { id }, context) => {
      const user = authCheck(context);
      const targetShop = await Shop.findById(id);
      const targetUser = await User.findById(user.id);
      const followed = targetShop.followers.find((item) => item == user.id);
      if (followed) {
        targetShop.followers = targetShop.followers.filter(
          (item) => item != user.id
        );
        targetUser.following = targetUser.following.filter(
          (item) => item != targetShop.id
        );
      } else {
        targetShop.followers = [...targetShop.followers, user.id];
        targetUser.following = [...targetUser.following, targetShop.id];
      }
      await targetShop.save();
      context.pubsub.publish("NEW_FOLLOWER", {
        onFollow: targetUser,
      });
      await targetUser.save();
      return true;
    },
    updateShop: async (parent, args) => {
      const { id, region, city, images } = args;
      const shop = await Shop.findById(id);
      shop.region = region ? region : shop.region;
      shop.city = city ? city : shop.city;
      shop.images = images;
      await shop.save();
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
