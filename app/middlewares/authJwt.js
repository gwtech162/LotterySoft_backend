const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

verifyToken = (req, res, next) => {
  let authHeader  = req.headers.authorization;
  if (!authHeader) {
    res.status(401).send('Authorization header missing.');
    return;
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    res.status(401).send('Token missing.');
    return;
  }

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      res.status(401).send({success: false, message: "Unauthorized!" });
      return;
    }
    req.userId = decoded.id;
    next();
  });
};

isAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user && user.role === "admin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Admin Role!" });
    return;
  });
};

isSubAdmin = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user && user.role === "subAdmin") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Sub Admin Role!" });
    return;
  });
};

isSuperVisor = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user && user.role === "superVisor") {
      next();
      return;
    }

    res.status(403).send({ message: "Require SuperVisor Role!" });
    return;
  });
};

isSeller = (req, res, next) => {
  User.findById(req.userId).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (user && user.role === "seller") {
      next();
      return;
    }

    res.status(403).send({ message: "Require Seller Role!" });
    return;
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isSubAdmin,
  isSuperVisor,
  isSeller,
};
module.exports = authJwt;
