const Post = require("../models/Posts");
const User = require("../models/User");

//@desc     Get all tasks (Admin: all , User: only assigned tasks)
//@route    GET /api/tasks/
//acess     Private

// =========================
// Admin: get all posts
// =========================
const getAdminPosts = async (req, res) => {
  try {
    // Only allow admin
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({ message: "Access denied" });
    }

    const posts = await Post.find().populate("createdBy", "name email profileImageUrl");
    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// Member: get only own posts
// =========================
const getMemberPosts = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const posts = await Post.find({ createdBy: req.user._id }).populate(
      "createdBy",
      "name email profileImageUrl"
    );
    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =========================
// Public: get all posts (Home Page)
// =========================
const getAllPostsPublic = async (req, res) => {
  try {
    const posts = await Post.find().populate("createdBy", "name email profileImageUrl");
    res.status(200).json({ success: true, posts });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};


//@desc     Get task by id
//@route    GET /api/tasks/:id
//acess     Private
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "createdBy",
      "name email profileImageUrl"
    );

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    res.status(200).json({ success: true, post });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

//@desc     Create a new task (admin only)
//@route    POST /api/tasks/
//acess     Private (Admin)
const createPost = async (req, res) => {
  try {
    const { title, description, postImageUrl } = req.body;
    console.log("hi x", req.body);

    const post = await Post.create({
      title,
      description,
      postImageUrl,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    console.log("hi errotr ");
    res.status(500).json({ message: " server error", error: error.message });
  }
};

// @desc     Update post details
// @route    PUT /api/posts/:id
// @access   Private
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    post.title = req.body.title || post.title;
    post.description = req.body.description || post.description;
    post.postImageUrl = req.body.postImageUrl || post.postImageUrl;

    const updatedPost = await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc     Delete a post (Admin only or Owner)
// @route    DELETE /api/posts/:id
// @access   Private
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res
        .status(404)
        .json({ success: false, message: "Post not found" });
    }

    await post.deleteOne();

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

// @desc     Dashboard data (All Users' Posts)
// @route    GET /api/posts/dashboard-data
// @access   Private/Admin
const getDashboardPostsData = async (req, res) => {
  try {
    // Total posts
    const totalPosts = await Post.countDocuments();

    // Fetch recent 10 posts across all users
    const recentPosts = await Post.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "fullName email") // optional: show author info
      .select("title description createdBy createdAt");

    res.status(200).json({
      statistics: {
        totalPosts,
      },
      recentPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// @desc     Dashboard data (Logged-in User's Posts)
// @route    GET /api/posts/user-dashboard-data
// @access   Private
const getUserDashboardPostsData = async (req, res) => {
  try {
    const userId = req.user._id;

    // Total posts by user
    const totalPosts = await Post.countDocuments({ createdBy: userId });

    // Fetch recent 10 posts for this user
    const recentPosts = await Post.find({ createdBy: userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("createdBy", "fullName email")
      .select("title description createdBy createdAt");

    res.status(200).json({
      statistics: {
        totalPosts,
      },
      recentPosts,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

// Add comment to a post
const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "Post not found" });

    post.comments.push({ text, createdBy: req.user._id });
    await post.save();

    // Populate comments with user names
    const updatedPost = await Post.findById(postId)
      .populate("createdBy", "name")
      .populate("comments.createdBy", "name");

    res.status(200).json({ post: updatedPost });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Fetch a single post with comments
const getPostWithComments = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("createdBy", "name")
      .populate("comments.createdBy", "name");

    if (!post) return res.status(404).json({ message: "Post not found" });

    res.status(200).json({ post });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};



module.exports = {
  getAdminPosts,
  getMemberPosts,
  getAllPostsPublic,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  addComment,
  getPostWithComments,
};
