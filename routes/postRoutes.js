const express = require("express");
const router = express.Router();
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} = require("../controllers/postController");

router.get("/",  getPosts); // ✅ no ()
router.get("/:id",  getPostById);
router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

module.exports = router;
