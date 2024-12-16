const db = require("../models");
const User = db.user;

checkDuplicateuserName = async (req, res, next) => {
  try {
    const user = await User.findOne({ userName: req.body.userName, _id: {$ne: req.params.id} });
    if (user) {
      res.status(400).send({ error: "Username already in use!" });
      return;
    }

    next();
  } catch (err) {
    res.status(500).send(err);
  }
};

checkRolesExisted = (req, res, next) => {
  const { role } = req.body;
  if (!role) {
    res.status(400).send({ error: "Role field is required!" });
    return;
  }
  if (!User.schema.path("role").enumValues.includes(role)) {
    res.status(400).send({ error: "Invalid role value!" });
    return;
  }
  next();
};

const verifySignUp = {
  checkDuplicateuserName,
  checkRolesExisted,
};

module.exports = verifySignUp;
