const Post = require("../../models/Post");
const authCheck = require("../../util/authCheck");

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
    likePost: async (parent, args, context, info) => {
      const { postId } = args;
      const user = authCheck(context);
      const post = await Post.findById(postId);
      const find = post.likes.find((item) => item.userName === user.userName);
      if (find) {
        post.likes = post.likes.filter((it) => it.userName !== user.userName);
      } else {
        post.likes = [
          {
            userName: user.userName,
            createdAt: new Date().toISOString(),
          },
          ...post.likes,
        ];
      }
      const res = await post.save();
      return res;
    },
    commentPost: async (parent, args, context, info) => {
      const { postId, body } = args;
      const { userName } = authCheck(context);
      const post = await Post.findById(postId);
      if (body !== "") {
        post.comments = [
          {
            body,
            userName,
            createdAt: new Date().toISOString(),
          },
          ...post.comments,
        ];
      }
      const res = await post.save();
      return res;
    },
    deleteCommentPost: async (parent, args, context, info) => {
      try {
        const { postId, commentId } = args;
        const user = authCheck(context);
        const post = await Post.findById(postId);
        const comment = post.comments.find((it) => it.id === commentId);
        if (comment && comment.userName === user.userName) {
          post.comments = post.comments.filter((item) => item.id !== commentId);
          const res = await post.save();
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
