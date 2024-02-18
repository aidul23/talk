const User = require("../models/userModel");
const bcrypt = require('bcrypt');

module.exports.register = async (req, res, next) => {
    try {
        const {username, email, password} = req.body;

    const userNameCheck = await User.findOne({username});
    if(userNameCheck) {
        return res.json({msg: "username already used!", status: false});
    }
    const emailCheck = await User.findOne({email});
    if(emailCheck) {
        return res.json({msg: "email already used!", status: false});
    }
    
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        username,
        email,
        password: hashPassword
    });

    delete user.password;

    return res.json({status: true, user});
    } catch (error) {
        next(error);
    }
};