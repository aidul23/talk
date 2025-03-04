const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");

const app = express();

require("dotenv").config();
const PORT = process.env.PORT;
const DB_URL = process.env.DB_URL;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(cors({origin: "https://t.co/sVzPDW9Ytw", credentials: true}))
app.use(cors({
  origin: "https://talk-loi1-frontend.vercel.app",
  credentials: true,
  methods: ["GET", "POST", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

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

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

const server = app.listen(PORT || 5001, () => {
  console.log(`server is running ${PORT}`);
});

const io = require("socket.io")(server, {
  cors: {
    origin: "https://talk-loi1-frontend.vercel.app",
    methods: ["GET", "POST", "OPTIONS"],
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
