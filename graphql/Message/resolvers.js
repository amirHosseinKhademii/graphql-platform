const { PubSub, withFilter } = require("apollo-server");
const Message = require("../../models/Message");
const authCheck = require("../../util/authCheck");
const pubsub = new PubSub();

module.exports = {
  Query: {
    getMessages: async (parent, args, context, info) => {
      const messages = await Message.find().sort({ createdAt: -1 });
      return messages;
    },
  },
  Mutation: {
    createMessage: async (parent, args, context, info) => {
      const { userName } = authCheck(context);
      const { text, channelId } = args;
      try {
        const newMessage = new Message({
          text,
          userName,
          channelId,
          createdAt: new Date().toISOString(),
        });
        await newMessage.save();
        pubsub.publish("MESSAGE_SENT", {
          newMessage: res,
          channelId,
        });
        return true;
      } catch (error) {
        console.log(error);
      }
    },
  },
  Subscription: {
    newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("MESSAGE_SENT"),
        (payload, args) => {
          return payload.channelId === args.channelId;
        }
      ),
    },
  },
};
