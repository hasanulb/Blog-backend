const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    postImageUrl: String,
    isPublished: { type: Boolean, default: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    comments: [commentSchema], // Embed comments
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
