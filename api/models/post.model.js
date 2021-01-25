const mongoose = require("mongoose");

const postSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  postType: { type: String },
  taskCategory: { type: String },
  taskType: { type: String },
  location: { type: String },
  description: { type: String },
  uploadDate: { type: Number },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("Post", postSchema);
