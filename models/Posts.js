const mongoose = require("mongoose");
require("./User"); // Ensure the User model is registered

const todoSchema = new mongoose.Schema({
  text: { type: String, required: true },
  completed: { type: Boolean, default: false },
});

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    postImageUrl: { type: String, default: null },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
