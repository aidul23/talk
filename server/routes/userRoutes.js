const express = require("express");
const { register, login, setAvatar, getAllUsers, proxyAvatar } = require("../controllers/userController");
const router = express.Router();

router.post("/register",register);
router.post("/login",login);
router.post("/setAvatar/:id",setAvatar);
router.get("/allusers/:id",getAllUsers);
// router.get('/proxy-avatar', proxyAvatar);

module.exports = router;