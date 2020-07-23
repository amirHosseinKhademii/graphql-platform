const authCheck = require("../../util/authCheck");
const Post = require("../../models/Post");

module.exports = {
  Query: {
    getPosts: async (parent, args, context, info) => {
      const posts = await Post.find();
      return posts;
    },
    getPost: async (parent, args, context, info) => {
      const { postId } = args;
      const post = await Post.findById(postId);
      return post;
    },
  },
  Mutation: {
    addPost: async (parent, args, context, info) => {
      const { content, image } = args;
      const user = authCheck(context);
      const newPost = new Post({
        content,
        image,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userName: user.userName,
      });
      const res = await newPost.save();
      return res;
    },
    deletePost: async (parent, args, context, info) => {
      const { postId } = args;
      const post = await Post.findById(postId);
      const res = await post.delete();
      return res;
    },
    updatePost: async (parent, args, context, info) => {
      const { postId, image, content } = args;
      const post = await Post.findById(postId);
      post.content = content !== "" ? content : post.content;
      post.image = image !== "" ? image : post.image;
      post.updatedAt = new Date().toISOString();
      const res = await post.save();
      return res;
    },
  },
};
