const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String },
  email: { type: String },
  password: { type: String },

  posts: [
    {
      _id: false,
      postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    },
  ],
});

module.exports = mongoose.model("User", userSchema);
