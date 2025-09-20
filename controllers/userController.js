// const Post = require("../models/Posts");
// const User = require("../models/User");
// const bcrypt = require("bcryptjs");
// const { param } = require("../routes/authRoutes");

// //@desc     Get all users (Admin only)
// //@route    GET /api/users/
// //acess     Private (Admin)
// const getUsers = async (req,res) =>{
//     try {
        
//         const users = await User.find({ role:'member'}).select("-password");



//         // Add task count to each user
//         const usersWithTaskCounts = await Promise.all(users.map(async (user) => {
//             const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending"});
//             const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress"}); 
//             const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed"}); 



//             return{
//                 ...user._doc, // Include all existing user data
//                 pendingTasks,
//                 inProgressTasks,
//                 completedTasks
//             }
//      }));
//      res.json(usersWithTaskCounts)
       
//     } catch (error) {
//     res.status(500).json({ message: " server error", error: error.message });
        
//     }
// }

// //@desc     Get user by id
// //@route    GET /api/users/:id
// //acess     Private 
// const getUserById = async (req,res) =>{
//     try {
//         const user = await User.findById(req.params.id).select("-password");
//         if(!user) return res.status(404).json({ message: "user not found"});
//         res.json(user)
//     } catch (error) {
//     res.status(500).json({ message: " server error", error: error.message });
        
//     }
// }

// module.exports = { getUsers, getUserById };
const Post = require("../models/Posts");
const User = require("../models/User");

//@desc     Get all users (Admin only)
//@route    GET /api/users/
//access    Private (Admin)
const getUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "member" }).select("-password");

    // Add posts for each user
    const usersWithPosts = await Promise.all(
      users.map(async (user) => {
        const posts = await Post.find({ author: user._id }); // assuming 'author' field links post to user

        return {
          ...user._doc, // include existing user data
          posts,
        };
      })
    );

    res.json(usersWithPosts);
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

//@desc     Get user by id
//@route    GET /api/users/:id
//access    Private
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "user not found" });

    // Include posts for this user
    const posts = await Post.find({ author: user._id });

    res.json({
      ...user._doc,
      posts,
    });
  } catch (error) {
    res.status(500).json({ message: "server error", error: error.message });
  }
};

module.exports = { getUsers, getUserById };
