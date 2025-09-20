const express = require("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// GET all users (admin only)
router.get("/", protect, adminOnly, getAllUsers);

// GET single user (admin only)
router.get("/:id", protect, adminOnly, getUserById);

// PUT to update user (admin only)
router.put("/:id", protect, adminOnly, updateUser);

// DELETE user (admin only)
router.delete("/:id", protect, adminOnly, deleteUser);

module.exports = router;
