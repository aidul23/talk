const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");
const socket = require("socket.io");

const app = express();

require("dotenv").config();
const PORT = 5001;
const DB_URL = process.env.DB_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(
//   cors({
//     origin: "https://talk-loi1-frontend.vercel.app",
//     methods: ["GET", "POST", "OPTIONS"],
//     allowedHeaders: ["Content-Type", "Authorization"],
//   })
// );

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

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

const server = app.listen(process.env.PORT, () => {
  console.log(`server is running`);
});

const io = socket(server, {
  cors: {
    origin: "https://talk-loi1-frontend.vercel.app",
    methods: ["POST", "GET", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  },
});

global.onlineUsres = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsres.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsres.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});
