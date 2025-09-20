const express = require("express");
const {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
} = require("../controllers/authController");
const { protect } = require("../middlewares/authMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const cloudinary = require("../config/cloudinary");

const router = express.Router();

// Auth Routes
router.post("/register", registerUser); // Register User
router.post("/login", loginUser); // Login User
router.get("/profile", protect, getUserProfile); //Get User Profile
router.put("/profile", protect, updateUserProfile); //Update User Profile

// Upload Image to Cloudinary
router.post("/upload-image", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  try {
    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "user_uploads", // Optional folder
      resource_type: "image",
    });

    // Return Cloudinary URL
    res.status(200).json({ imageUrl: result.secure_url });
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    res.status(500).json({ message: "Image upload failed" });
  }
});

module.exports = router;
