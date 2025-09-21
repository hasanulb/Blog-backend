// require("dotenv").config();
// const express = require("express");
// const http = require("http");
// const { Server } = require("socket.io");
// const path = require("path");
// const connectDB = require("./config/db");

// // Routes
// const authRoutes = require("./routes/authRoutes");
// const userRoutes = require("./routes/userRoutes");
// const postRoutes = require("./routes/postRoutes");

// const app = express();

// // Middleware to parse JSON
// app.use(express.json());

// // CORS setup
// const allowedOrigins = [
//   "http://localhost:5173", // local dev
//   "https://blog-frontend-rbgw.vercel.app", // deployed frontend
// ];

// app.use(
//   require("cors")({
//     origin: function (origin, callback) {
//       if (!origin) return callback(null, true); // allow non-browser requests
//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(new Error("CORS not allowed"));
//       }
//     },
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   })
// );

// // Connect to database
// connectDB();

// // Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/posts", postRoutes);
// app.use("/api/users", userRoutes);
// // app.use("/api/reports", reportRoutes);

// // Serve uploads folder
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// // Create HTTP server
// const server = http.createServer(app);

// // Setup Socket.IO with CORS
// const io = new Server(server, {
//   cors: {
//     origin: allowedOrigins,
//     methods: ["GET", "POST"],
//   },
// });

// // Attach io to app for usage in routes if needed
// app.set("io", io);

// // Socket.IO events
// io.on("connection", (socket) => {
//   console.log("User connected:", socket.id);

//   // Join a post room
//   socket.on("joinPost", (postId) => {
//     socket.join(postId);
//   });

//   // Broadcast new comment
//   socket.on("newComment", (data) => {
//     const { postId, comment } = data;
//     io.to(postId).emit("receiveComment", comment);
//   });

//   socket.on("disconnect", () => {
//     console.log("User disconnected:", socket.id);
//   });
// });

// // Start server
// const PORT = process.env.PORT || 8000;
// server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const postRoutes = require("./routes/postRoutes");

const app = express();

// Middleware to parse JSON
app.use(express.json());

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173", // local dev frontend
  "https://blog-frontend-rbgw.vercel.app", // deployed frontend
];

app.use(
  require("cors")({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Connect to MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", userRoutes);

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Create HTTP server
const server = http.createServer(app);

// ✅ Setup Socket.IO with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
  },
});

// Make io accessible in routes if needed
app.set("io", io);

// Socket.IO events
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join a post room
  socket.on("joinPost", (postId) => {
    socket.join(postId);
  });

  // Broadcast new comment to room
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
