const mongoose = require("mongoose");

const Post = require("../models/post.model");
const User = require("../models/user.model");

const createPost = async (req, res) => {
  const { postType, taskCategory, taskType, location, description } = req.body;
  const user = req.user.userId;
  const uploadDate = Date.now();

  if (!postType || !taskCategory || !taskType || !location || !description) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.body",
    });
  }

  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    postType,
    taskCategory,
    taskType,
    location,
    description,
    uploadDate,
    user,
  });

  await post
    .save()
    .then(async (result) => {
      await User.updateOne(
        { _id: user },
        { $push: { posts: { postId: result._id } } }
      )
        .then(() => {
          res.status(201).json({
            message: "Posted successfully",
          });
        })
        .catch((err) => {
          res.status(500).json({
            message: "Something went wrong",
            error: err.toString(),
          });
        });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getAllPosts = async (req, res) => {
  await Post.find()
    .populate("user", "name")
    .select("-__v")
    .then(async (posts) => {
      res.status(200).json({
        numberOfPosts: posts.length,
        posts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getPostByID = async (req, res) => {
  const { postId } = req.query;

  if (!postId) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.query",
    });
  }

  await Post.findById(postId)
    .populate("user", "name")
    .select("-__v")
    .then(async (post) => {
      res.status(200).json({
        post,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid post ID",
        error: err.toString(),
      });
    });
};

const searchPosts = async (req, res) => {
  const { query } = req.query;

  await Post.find({
    $or: [
      { postType: new RegExp(".*" + query + ".*", "i") },
      { taskCategory: new RegExp(".*" + query + ".*", "i") },
      { taskType: new RegExp(".*" + query + ".*", "i") },
      { location: new RegExp(".*" + query + ".*", "i") },
    ],
  })
    .select("-__v")
    .populate("user", "name")
    .then(async (posts) => {
      res.status(200).json({
        numberOfPosts: posts.length,
        posts,
      });
    })
    .catch((err) => {
      res.status(500).json({
        message: "Something went wrong",
        error: err.toString(),
      });
    });
};

const getAllPostsOfAUser = async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({
      message: "1 or more parameter(s) missing from req.query",
    });
  }

  await Post.find({ user: userId })
    .populate("user", "name")
    .select("-__v")
    .then(async (post) => {
      res.status(200).json({
        post,
      });
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid user ID",
        error: err.toString(),
      });
    });
};

const deletePost = async (req, res) => {
  const { postId } = req.body;
  const userId = req.user.userId;

  await Post.findById(postId)
    .then(async (post) => {
      if (post.user.equals(userId)) {
        await Post.deleteOne({ _id: postId })
          .then(async () => {
            await User.updateOne(
              { _id: userId },
              { $pull: { posts: { postId } } }
            )
              .then(() => {
                res.status(200).json({
                  message: "Post deleted successfully",
                });
              })
              .catch((err) => {
                res.status(404).json({
                  message: "Invalid post ID",
                  error: err.toString(),
                });
              });
          })
          .catch((err) => {
            res.status(404).json({
              message: "Invalid post ID",
              error: err.toString(),
            });
          });
      } else {
        return res.status(403).json({
          message: "This is not your post",
        });
      }
    })
    .catch((err) => {
      res.status(404).json({
        message: "Invalid post ID",
        error: err.toString(),
      });
    });
};

module.exports = {
  createPost,
  getAllPosts,
  getPostByID,
  searchPosts,
  getAllPostsOfAUser,
  deletePost,
};
