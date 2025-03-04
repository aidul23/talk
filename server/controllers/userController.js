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

// module.exports.proxyAvatar = async (req, res, next) => {
//   try {
//     const { avatarId } = req.query;

//     if (!avatarId) {
//       return res.status(400).json({ error: 'Avatar ID is required' });
//     }

//     // Fetch avatar image from MultiAvatar API
//     const response = await axios.get(`https://api.multiavatar.com/${avatarId}`, {
//       headers: { 'Content-Type': 'image/svg+xml' },
//     });

//     // Return the SVG data as the response
//     res.setHeader('Content-Type', 'image/svg+xml');
//     res.send(response.data);
//   } catch (error) {
//     console.error('Error fetching avatar:', error);
//     res.status(500).json({ error: 'Failed to fetch avatar' });
//   }
// };

module.exports.setAvatar = async (req, res, next) => {
  try {
    const userId = req.params.id;
    // Check if the user has uploaded an avatar or not
    const userData = await User.findById(userId);
    
    if (!userData.isAvatarImageSet) {
      // Return the default avatar URL if no custom avatar is set
      userData.avatarImage = "public/public/profile-avatar.png"; // Static path to the default avatar image
    }

    return res.json({
      isSet: userData.isAvatarImageSet,
      image: userData.avatarImage,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getAllUsers = async (req, res, next) => {
  try {
    const user = await User.find({_id: { $ne: req.params.id } }).select([
      "email", 
      "username", 
      "avatarImage", 
      "_id",
    ]);
    return res.json(user);
  } catch (error) {
    next(error)
  }
};