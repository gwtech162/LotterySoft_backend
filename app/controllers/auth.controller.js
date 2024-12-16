const config = require("../config/auth.config");
const db = require("../models");
const User = db.user;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

exports.signUp = async (req, res) => {
  try {
    const { userName, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ userName, email, password: hashedPassword, role });
    await user.save();
    req.user = user;
    res.send(user);
  } catch (err) {
    res.status(500).send(err);
  }
};

exports.signIn = async (req, res) => {
  try {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName });
    if (!user) {
      res.send({success: false, message: "User not found!"});
      return;
    }

    if ( !user.isActive ) {
      res.send({success: false, message: "Locked now!"});
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.send({success: false, message: "Invalid password!"});
      return;
    }

    var token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: '10h'
    });

    req.session.token = token;
    res.send({success: true, user, token:token});
  } catch (err) {
    console.log(err);
    res.status(500).send({message: err});
  }
};

exports.signOut = async (req, res) => {
  try {
    req.session = null;
    res.send({ success: true, message: "You've been signed out!" });
  } catch (err) {
    this.next(err);
  }
};