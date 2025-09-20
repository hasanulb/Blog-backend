require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");
// const reportRoutes = require("./routes/reportRoutes");

const app = express();

// Middleware
app.use(express.json());

// CORS setup
app.use(
  require("cors")({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect Database
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);
// app.use("/api/reports", reportRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create HTTP server
const server = http.createServer(app);

// Setup Socket.IO
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST"],
  },
});

// Attach io to app for usage in routes if needed
app.set("io", io);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a post room
  socket.on("joinPost", (postId) => {
    socket.join(postId);
  });

  // Broadcast new comment
  socket.on("newComment", (data) => {
    const { postId, comment } = data;
    io.to(postId).emit("receiveComment", comment);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
