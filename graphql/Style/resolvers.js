const Style = require("../../models/style");

module.exports = {
  Query: {
    getStyles: async (parent, args, context, info) => {
      const styles = await Style.find();
      return styles;
    },
  },
  Mutation: {
    addStyle: async (parent, args, context, info) => {
      const { style } = args;
      const newStyle = new Style({
        style,
      });
      await newStyle.save();
      return true;
    },
  },
};
