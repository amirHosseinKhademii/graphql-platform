const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { UserInputError } = require("apollo-server");
const config = require("config");
const User = require("../../models/User");
const authCheck = require("../../util/authCheck");
// generate token
const tokenGenerator = (user) => {
  const secret = config.get("secretKey");
  return jwt.sign(
    { id: user.id, email: user.email, userName: user.userName },
    secret,
    { expiresIn: "100h" }
  );
};
// other shits
module.exports = {
  Query: {
    getUsers: async (parent, args) => {
      try {
        const users = await User.find();
        return users;
      } catch (error) {
        console.error(error);
      }
    },
    getUser: async (parent, args, context, info) => {
      try {
        const user = await User.findById(args.userId);
        return user;
      } catch (error) {
        console.error(error);
      }
    },
    getFollowers: async (parent, args, context, info) => {
      const { userId } = args;
      const user = await User.findById(userId);
      let followers = [];
      user.followers.forEach((item) => {
        const following = User.findById(item);
        followers.push(following);
      });
      return followers;
    },
  },
  Mutation: {
    signup: async (parent, args, context, info) => {
      const { name, lastName, userName, email, password } = args;
      const user = await User.findOne({ email: email });
      const userByUserName = await User.findOne({ userName: userName });
      //validation
      if (user || userByUserName) {
        throw new UserInputError("کاربر تکراری", {
          errors: {
            msg: "این کاربر  قبلا ثبت شده است",
          },
        });
      } else if (
        name.trim() === "" ||
        lastName.trim() === "" ||
        email.trim() === "" ||
        password.trim() === "" ||
        userName.trim() === ""
      ) {
        throw new UserInputError(" فیلد پر نشده", {
          errors: {
            msg: "تمام ردیف ها باید پر شوند",
          },
        });
      } else {
        const hashed = await bcrypt.hash(password, 12);
        const newUser = new User({
          name,
          lastName,
          userName,
          email,
          password: hashed,
          createdAt: new Date().toDateString(),
        });
        const res = await newUser.save();
        context.pubsub.publish("NEW_USER", {
          signupUser: res,
        });
        const token = tokenGenerator(res);
        return token;
      }
    },
    login: async (parent, args, context, info) => {
      const { userName, password } = args;
      const user = await User.findOne({ userName });
      if (!user) {
        throw new UserInputError("ایمیل نا معتبر", {
          errors: { msg: "این ایمیل ثبت نشده است" },
        });
      } else {
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
          throw new UserInputError("رمز نا معتبر", {
            errors: { msg: "رمز وارد شده اشتباه است" },
          });
        } else {
          const token = tokenGenerator(user);
          return token;
        }
      }
    },
    createProfile: async (parent, args, context, info) => {
      const { image, address, phone, idCode, postCode } = args;
      const { userName } = authCheck(context);
      const user = await User.findOne({ userName });
      if (user) {
        user.profile = { image, address, phone, idCode, postCode, userName };
        await user.save();
        return true;
      } else {
        throw new UserInputError("کاربر نا معتبر", {
          errors: { msg: "این نام کاربری ثبت نشده است" },
        });
      }
    },
    addFollower: async (parent, args, context, info) => {
      const { userId } = args;
      const user = authCheck(context);
      const targetUser = await User.findById(userId);
      const find = targetUser.followers.find((it) => it === user.id);
      if (find) {
        targetUser.followers = targetUser.followers.filter(
          (ite) => ite !== user.id
        );
      } else {
        targetUser.followers = [...targetUser.followers, user.id];
      }
      await targetUser.save();
      return true;
    },
  },
  Subscription: {
    signupUser: {
      subscribe: (_, __, { pubsub }) => {
        return pubsub.asyncIterator("NEW_USER");
      },
    },
  },
};