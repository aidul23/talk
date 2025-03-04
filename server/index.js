// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const userRoutes = require("./routes/userRoutes");
// const messagesRoute = require("./routes/messagesRoute");

// const app = express();

// require("dotenv").config();
// const PORT = process.env.PORT;
// const DB_URL = process.env.DB_URL;

// app.use(express.urlencoded({ extended: true }));
// app.use(express.json());

// // app.use(cors({origin: "https://t.co/sVzPDW9Ytw", credentials: true}))
// const allowedOrigins = ["https://talk-loi1-frontend.vercel.app"];

// app.use(cors({
//   origin: function (origin, callback) {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
//   methods: ["GET", "POST", "OPTIONS"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));

// app.options("*", cors());

// mongoose
//   .connect(DB_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB is connected");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// app.use("/api/auth", userRoutes);
// app.use("/api/messages", messagesRoute);

// const server = app.listen(PORT || 5001, () => {
//   console.log(`server is running ${PORT}`);
// });

// const io = require("socket.io")(server, {
//   cors: {
//     origin: "https://talk-loi1-frontend.vercel.app",
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//     credentials: true,
//   },
// });

// global.onlineUsres = new Map();

// io.on("connection", (socket) => {
//   global.chatSocket = socket;
//   socket.on("add-user", (userId) => {
//     onlineUsres.set(userId, socket.id);
//   });

//   socket.on("send-msg", (data) => {
//     const sendUserSocket = onlineUsres.get(data.to);
//     if (sendUserSocket) {
//       socket.to(sendUserSocket).emit("msg-recieve", data.message);
//     }
//   });
// });

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// CORS configuration for Express routes
const allowedOrigins = ["https://talk-loi1-frontend.vercel.app","https://api.multiavatar.com"];  // Specify your frontend domain

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,  // Allows cookies to be sent with requests
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));  // Enable CORS middleware

// Routes
app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

// MongoDB Connection
mongoose
  .connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB is connected");
  })
  .catch((err) => {
    console.log(err.message);
  });

// Create HTTP server for Socket.io
const server = http.createServer(app);

// Socket.io with CORS enabled
const io = socketIo(server, {
  cors: {
    origin: "https://talk-loi1-frontend.vercel.app",  // Frontend URL allowed to connect
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,  // Important if you're using cookies for authentication
  },
});

global.onlineUsers = new Map();

// Socket.io connection
io.on("connection", (socket) => {
  console.log("A user connected with socket id:", socket.id);

  // Add user to online users map when they log in
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    console.log(`User ${userId} is now online`);
  });

  // Send message to the recipient if they are online
  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);  // Get the socket id of the recipient

    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);  // Send message to recipient
    }
  });

  // Handle user disconnect
  socket.on("disconnect", () => {
    console.log("A user disconnected");
    onlineUsers.forEach((value, key) => {
      if (value === socket.id) {
        onlineUsers.delete(key);  // Remove user from online users map
      }
    });
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

