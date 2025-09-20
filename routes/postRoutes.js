const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getAdminPosts,
  getMemberPosts,
  getAllPostsPublic,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getPostWithComments,
} = require("../controllers/postController");

router.get("/admin", protect, getAdminPosts);
router.get("/member", protect, getMemberPosts);
router.get("/public", getAllPostsPublic);
router.post("/", protect, createPost);

router.post("/:id/comment", protect, addComment); // MUST be before /:id
router.get("/:id/comments", getPostWithComments);
router.get("/:id", getPostById); // generic, last

router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
