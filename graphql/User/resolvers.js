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
    {
      id: user.id,
      email: user.email,
      userName: user.userName,
      type: user.type,
    },
    secret,
    { expiresIn: "100h" }
  );
};
// other shits
module.exports = {
  Query: {
    getUsers: async () => {
      try {
        const users = await User.find().populate("shops").populate("following");
        return users;
      } catch (error) {
        console.error(error);
      }
    },
    getUser: async (parent, args) => {
      try {
        const user = await User.findById(args.userId)
          .populate("shops")
          .populate("following");
        return user;
      } catch (error) {
        console.error(error);
      }
    },
  },
  Mutation: {
    signup: async (parent, args, context, info) => {
      const { name, lastName, userName, email, password, type } = args;
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
          type,
          password: hashed,
          createdAt: new Date().toDateString(),
        });
        const res = await newUser.save();
        context.pubsub.publish("NEW_USER", {
          signupUser: res,
        });

        return {
          name: res.name,
          lastName: res.lastName,
          userName: res.userName,
          email: res.email,
          type: res.type,
          token: tokenGenerator(res),
        };
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
          return {
            name: user.name,
            lastName: user.lastName,
            userName: user.userName,
            email: user.email,
            type: user.type,
            token: tokenGenerator(user),
          };
        }
      }
    },
    updateProfile: async (parent, args, context, info) => {
      const {
        country,
        region,
        city,
        address,
        phone,
        image,
        postCode,
        name,
        lastName,
      } = args;
      const { userName } = authCheck(context);
      const user = await User.findOne({ userName });
      if (user) {
        user.name = name ? name : user.name;
        user.lastName = lastName ? lastName : user.lastName;
        user.profile = {
          country: country ? country : user.profile.country,
          region: region ? region : user.profile.region,
          city: city ? city : user.profile.city,
          address: address ? address : user.profile.address,
          phone: phone ? phone : user.profile.phone,
          image: image ? image : user.profile.image,
          postCode: postCode ? postCode : user.profile.postCode,
          userName: userName ? userName : user.profile.userName,
        };
        await user.save();
        return true;
      } else {
        throw new UserInputError("کاربر نا معتبر", {
          errors: { msg: "این نام کاربری ثبت نشده است" },
        });
      }
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
