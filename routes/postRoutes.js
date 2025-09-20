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
  addComment, getPostWithComments
} = require("../controllers/postController");

router.get("/admin", protect, getAdminPosts);
router.get("/member", protect, getMemberPosts);
router.get("/public", getAllPostsPublic);
router.get("/:id",  getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.get("/:id/comments", getPostWithComments);
router.post("/:id/comments", protect, addComment);

module.exports = router;
