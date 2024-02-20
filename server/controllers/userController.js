const User = require("../models/userModel");
const bcrypt = require("bcrypt");

module.exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const userNameCheck = await User.findOne({ username });

    if (userNameCheck) {
      return res.json({ msg: "username already used!", status: false });
    }

    const emailCheck = await User.findOne({ email });

    if (emailCheck) {
      return res.json({ msg: "email already used!", status: false });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    
    //create user and insert into database
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });

    delete user.password;

    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });

    if (!user) {
      return res.json({ msg: "incorrect username or password!", status: false });
    }

    const isPassValid = await bcrypt.compare(password, user.password);

    if (!isPassValid) {
      return res.json({ msg: "incorrect username or password!", status: false });
    }
    
    delete user.password;

    return res.json({ status: true, user });
  } catch (error) {
    next(error);
  }
};

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const avatarImage = req.body.image;
    const userData = await User.findByIdAndUpdate(userId, {
      isAvatarImageSet: true,
      avatarImage,
    });
    return res.json({isSet: userData.isAvatarImageSet, image: userData.avatarImage});
  } catch (error) {
    next(error)
  }
};