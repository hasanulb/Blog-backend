// const express = require("express");

// const {
//   getDashboardPostsData,
//   getUserDashboardPostsData,
//   getPosts,
//   getPostById,
//   createPost,
//   updatePost,
//   deletePost,
// } = require("../controllers/postController");

// const router = express.Router();

// // Task management routes
// router.get("/dashboard-data", protect, getDashboardPostsData);
// router.get("/user-dashboard-data", protect, getUserDashboardPostsData);
// router.get("/", protect, getPosts); // Get all tasks (Admin: all , User: assigned)
// router.get("/:id", protect, getPostById); // Get tasks by ID
// router.post("/", protect, createPost); // Create a task (Admin only)
// router.put("/:id", protect, updatePost); // Update task details
// router.delete("/:id", protect, adminOnly, deletePost); // Delete a task (Admin only)

// module.exports = router;

// Example correct file: postRoutes.js
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
