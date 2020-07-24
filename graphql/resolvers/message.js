const authCheck = require("../../util/authCheck");
const Message = require("../../models/Message");
const { PubSub, withFilter } = require("apollo-server");
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
      const user = authCheck(context);
      const { text, channelId } = args;
      try {
        const newMessage = new Message({
          text,
          user,
          channelId,
          createdAt: new Date().toISOString(),
        });
        const res = await newMessage.save();
        pubsub.publish("MESSAGE_SENT", {
          newMessage: res,
          channelId,
        });
        return res;
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

{
  /* newMessage: {
      subscribe: withFilter(
        () => pubsub.asyncIterator("messageAdded"),
        (payload, args) => payload.messageAdded.channelId === args.channelId
      ),
    },*/
}
