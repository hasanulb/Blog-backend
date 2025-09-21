const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Generate Web Token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc     Register a new user
// @route    POST api/auth/register
// acess     Public
const registerUser = async (req, res) => {
  const { name, email, password, adminInviteToken, profileImageUrl } = req.body;

  try {
    let userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // check role based on token
    let role = "member";
    if (
      adminInviteToken &&
      adminInviteToken === process.env.ADMIN_INVITE_TOKEN
    ) {
      role = "admin";
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log("password", hashedPassword);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      profileImageUrl,
    });

    if (user) {
      return res.status(201).json({
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImageUrl: user.profileImageUrl,
          token: generateToken(user._id),
        },
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};


//@desc     Login user
//@route    POST api/auth/login
//acess     Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: " Invalid email or password " });
    }

    // compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: " Invalid email or password " });
    }

    // Return user data with jwt
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImageUrl: user.profileImageUrl,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: " server error", error: error.message });
  }
};

//@desc     Get User Profile
//@route    POST api/auth/profile
//acess     Private (requires JWT)
const getUserProfile = async (req, res) => {
  try {
    // req.user is populated by protect middleware
    res.json({ user: req.user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

//@desc     Update User Profile
//@route    PUT api/auth/profile
//acess     Private (requires JWT)
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const { name, email, profileImageUrl, currentPassword, newPassword } =
      req.body;

    // Update basic info
    if (name) user.name = name;
    if (email) user.email = email;
    if (profileImageUrl) user.profileImageUrl = profileImageUrl;

    // Handle password change
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ message: "Current password is incorrect" });
      }
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };
