// require("dotenv").config();
// const express = require("express");
// const cors = require("cors");
// const path = require("path");
// const connectDB = require("./config/db");

// const app = express();

// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const postRoutes = require("./routes/postRoutes");
// const reportRoutes = require("./routes/reportRoutes");

// // Middleware to handle CORS
// app.use(
//   cors({
//     origin: process.env.CLIENT_URL || "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

// // Connect Database
// connectDB();

// // Middleware
// app.use(express.json());

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/users", userRoutes);
// // app.use("/api/reports", reportRoutes);

// // Serve Upload Folder
// app.use("/uploads",express.static(path.join(__dirname, "uploads")));

// // Start Server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`server running on port ${PORT}`));

const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

// Existing middleware, routes, etc.
app.use(express.json());

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: "*", // restrict in production
    methods: ["GET", "POST"]
  }
});

// Listen for connection
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room for a specific post
  socket.on("joinPost", (postId) => {
    socket.join(postId);
  });

  // Listen for new comment
  socket.on("newComment", (data) => {
    const { postId, comment } = data;

    // Broadcast the comment to everyone in the same post room
    io.to(postId).emit("receiveComment", comment);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Export io if needed in routes
app.set("io", io);

server.listen(process.env.PORT || 8000, () => {
  console.log("Server running");
});
