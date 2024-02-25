const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messagesRoute = require("./routes/messagesRoute");

const app = express();
require("dotenv").config();
const PORT = process.env.PORT || 5001;
const DB_URL = process.env.DB_URL;

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/messages", messagesRoute);

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB is connected");
}).catch((err) => {
    console.log(err.message);
});

app.listen(PORT, () => {
    console.log(`server is running on http://localhost:${PORT}`);
});